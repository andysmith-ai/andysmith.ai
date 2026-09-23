import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import YAML from "yaml";

const POST_PATH = /^src\/(\d{4})\/([A-Z][a-z]{2})\/(\d{1,2})\/([^/]+)\/index\.md$/;
const API_VERSION = "2022-11-28";
const USER_AGENT = "andysmith-ai-announcement-reconciler";
const BLUESKY_MAX_CODE_POINTS = 300;
const BLUESKY_THUMB_MAX_BYTES = 1_000_000;
const BLUESKY_IMAGE_MAX_BYTES = 2_000_000;
const LINK_ARROW = "→";
const EXTERNAL_FETCH_TIMEOUT_MS = 15_000;

function parseFrontmatter(source) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source.replace(/\r\n?/g, "\n"));
  if (!match) throw new Error("post is missing YAML frontmatter");
  const data = YAML.parse(match[1]);
  if (!data || typeof data !== "object") throw new Error("post frontmatter must be an object");
  return { data, body: match[2].trim() };
}

function publicPostUrl(relativePath, siteBaseUrl) {
  const match = POST_PATH.exec(relativePath);
  if (!match) throw new Error(`unsupported post path: ${relativePath}`);
  return `${siteBaseUrl.replace(/\/+$/, "")}/${match[1]}/${match[2]}/${match[3]}/${match[4]}/`;
}

function receiptPath(postPath, channel) {
  return path.posix.join(path.posix.dirname(postPath), `${channel}.json`);
}

function codePointLength(value) {
  return Array.from(value).length;
}

function htmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function publicBlueskyUrl(handle, uri) {
  const rkey = uri.split("/").at(-1);
  if (!rkey) throw new Error("Bluesky response URI has no record key");
  return `https://bsky.app/profile/${encodeURIComponent(handle)}/post/${encodeURIComponent(rkey)}`;
}

function sanitizedError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/[\r\n]+/g, " ").slice(0, 500);
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function metaContent(html, key) {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = Object.fromEntries(
      Array.from(tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g), (match) => [match[1].toLowerCase(), match[2] ?? match[3]]),
    );
    if ((attributes.property ?? attributes.name)?.toLowerCase() !== key) continue;
    const content = decodeEntities(attributes.content ?? "").trim();
    if (content) return content;
  }
  return "";
}

function firstImage(body, baseUrl) {
  const match = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?[^)]*\)|<img\b[^>]*>/i.exec(body);
  if (!match) return undefined;
  const [tag, markdownAlt, markdownSrc] = match;
  const src = markdownSrc ?? /\bsrc\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
  if (!src) return undefined;
  const alt = markdownAlt ?? decodeEntities(/\balt\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1] ?? "");
  return { url: new URL(src, baseUrl).href, alt: alt.trim() };
}

async function postPaths(root) {
  const found = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      if (entry.isFile() && entry.name === "index.md") {
        const relative = path.relative(root, absolute).split(path.sep).join("/");
        if (POST_PATH.test(relative)) found.push(relative);
      }
    }
  }
  await visit(path.join(root, "src"));
  return found;
}

async function loadPost(root, relativePath, siteBaseUrl) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  const { data, body } = parseFrontmatter(source);
  const announcements = data.announcements;
  if (!announcements || typeof announcements !== "object") return null;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) throw new Error(`${relativePath}: title is required`);
  const date = new Date(data.date);
  if (Number.isNaN(date.getTime())) throw new Error(`${relativePath}: valid date is required`);
  const url = publicPostUrl(relativePath, siteBaseUrl);
  const link = typeof data.link === "string" && data.link.trim() ? data.link.trim() : undefined;
  return {
    path: relativePath,
    title,
    date,
    url,
    link,
    // A link post's single preview slot belongs to its external link.
    image: link ? undefined : firstImage(body, url),
    announcements: {
      telegram: typeof announcements.telegram === "string" ? announcements.telegram.trim() : "",
      bluesky: typeof announcements.bluesky === "string" ? announcements.bluesky.trim() : "",
    },
  };
}

async function loadReceipt(root, postPath, channel) {
  try {
    return JSON.parse(await readFile(path.join(root, receiptPath(postPath, channel)), "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

class GitHubReceiptStore {
  constructor({ repository, branch, token, fetchImpl = fetch }) {
    this.repository = repository;
    this.branch = branch;
    this.token = token;
    this.fetch = fetchImpl;
  }

  async request(filePath, init = {}, query = "") {
    const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
    const response = await this.fetch(`https://api.github.com/repos/${this.repository}/contents/${encodedPath}${query}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "X-GitHub-Api-Version": API_VERSION,
        ...init.headers,
      },
    });
    return response;
  }

  async currentSha(filePath) {
    const response = await this.request(filePath, {}, `?ref=${encodeURIComponent(this.branch)}`);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`GitHub receipt lookup failed: HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload || typeof payload.sha !== "string") throw new Error("GitHub receipt lookup returned no blob SHA");
    return payload.sha;
  }

  async save(filePath, receipt) {
    const content = Buffer.from(`${JSON.stringify(receipt, null, 2)}\n`, "utf8").toString("base64");
    let lastStatus = 0;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const sha = await this.currentSha(filePath);
      const response = await this.request(filePath, {
        method: "PUT",
        body: JSON.stringify({
          message: `receipt: ${filePath} [skip ci]`,
          content,
          branch: this.branch,
          ...(sha ? { sha } : {}),
        }),
      });
      if (response.ok) return;
      lastStatus = response.status;
      if (response.status !== 409 && response.status !== 422) {
        const detail = await response.text();
        throw new Error(`GitHub receipt write failed: HTTP ${response.status} ${detail.slice(0, 300)}`);
      }
    }
    throw new Error(`GitHub receipt write conflicted after 3 attempts: HTTP ${lastStatus}`);
  }
}

class TelegramClient {
  constructor({ token, chatId, username, fetchImpl = fetch }) {
    this.token = token;
    this.chatId = chatId;
    this.username = username.replace(/^@/, "");
    this.fetch = fetchImpl;
  }

  async publish(post) {
    if (!post.announcements.telegram) throw new Error("Telegram announcement is missing");
    const body = `${htmlEscape(post.announcements.telegram)}\n\n${htmlEscape(post.url)}`;
    const text = post.link ? body : `<b>${htmlEscape(post.title)}</b>\n\n${body}`;
    const response = await this.fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: this.chatId,
        text,
        parse_mode: "HTML",
        disable_notification: true,
        link_preview_options: post.link
          ? { url: post.link, show_above_text: true }
          : post.image
            ? { url: post.image.url, prefer_large_media: true, show_above_text: false }
            : { is_disabled: true },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok || typeof payload.result?.message_id !== "number") {
      const description = typeof payload?.description === "string" ? payload.description : `HTTP ${response.status}`;
      throw new Error(`Telegram rejected the announcement: ${description}`);
    }
    const messageId = payload.result.message_id;
    return {
      status: "published",
      published_at: new Date().toISOString(),
      message_id: messageId,
      url: `https://t.me/${this.username}/${messageId}`,
    };
  }
}

class BlueskyClient {
  constructor({ identifier, appPassword, serviceUrl = "https://bsky.social", fetchImpl = fetch }) {
    this.identifier = identifier;
    this.appPassword = appPassword;
    this.serviceUrl = (serviceUrl || "https://bsky.social").replace(/\/+$/, "");
    this.fetch = fetchImpl;
    this.session = null;
  }

  async authenticate() {
    if (this.session) return this.session;
    const response = await this.fetch(`${this.serviceUrl}/xrpc/com.atproto.server.createSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: this.identifier, password: this.appPassword }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || typeof payload?.accessJwt !== "string" || typeof payload?.did !== "string" || typeof payload?.handle !== "string") {
      throw new Error(`Bluesky authentication failed: HTTP ${response.status}`);
    }
    this.session = payload;
    return payload;
  }

  async createRecord(record) {
    const session = await this.authenticate();
    const response = await this.fetch(`${this.serviceUrl}/xrpc/com.atproto.repo.createRecord`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo: session.did,
        collection: "app.bsky.feed.post",
        record: { $type: "app.bsky.feed.post", ...record },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || typeof payload?.uri !== "string" || typeof payload?.cid !== "string") {
      throw new Error(`Bluesky rejected the announcement: HTTP ${response.status}`);
    }
    return { uri: payload.uri, cid: payload.cid, url: publicBlueskyUrl(session.handle, payload.uri) };
  }

  async publish(post) {
    const announcement = post.announcements.bluesky;
    if (!announcement) throw new Error("Bluesky announcement is missing");
    const prefix = `${announcement} `;
    const text = `${prefix}${LINK_ARROW}`;
    if (codePointLength(text) > BLUESKY_MAX_CODE_POINTS) {
      throw new Error(`Bluesky announcement with its link arrow exceeds ${BLUESKY_MAX_CODE_POINTS} code points`);
    }
    const encoder = new TextEncoder();
    const byteStart = encoder.encode(prefix).byteLength;
    return this.createRecord({
      text,
      facets: [{
        index: { byteStart, byteEnd: byteStart + encoder.encode(LINK_ARROW).byteLength },
        features: [{ $type: "app.bsky.richtext.facet#link", uri: post.url }],
      }],
      ...await this.embed(post),
      langs: ["en"],
      createdAt: new Date().toISOString(),
    });
  }

  async embed(post) {
    if (post.link) return { embed: await this.externalCard(post) };
    if (!post.image) return {};
    try {
      const blob = await this.uploadImage(post.image.url, BLUESKY_IMAGE_MAX_BYTES);
      return { embed: { $type: "app.bsky.embed.images", images: [{ image: blob, alt: post.image.alt }] } };
    } catch (error) {
      console.warn(`Bluesky: image ${post.image.url} is skipped: ${sanitizedError(error)}`);
      return {};
    }
  }

  async externalCard(post) {
    const external = { uri: post.link, title: post.title, description: "" };
    try {
      const response = await this.fetch(post.link, {
        headers: { Accept: "text/html", "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!(response.headers.get("content-type") || "").includes("html")) throw new Error("not an HTML page");
      const html = await response.text();
      const pageTitle = decodeEntities(/<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1] ?? "").trim();
      external.title = metaContent(html, "og:title") || pageTitle || post.title;
      external.description = metaContent(html, "og:description") || metaContent(html, "description");
      const image = metaContent(html, "og:image");
      if (image) external.thumb = await this.uploadImage(new URL(image, post.link).href, BLUESKY_THUMB_MAX_BYTES);
    } catch (error) {
      console.warn(`Bluesky: link card metadata for ${post.link} is incomplete: ${sanitizedError(error)}`);
    }
    return { $type: "app.bsky.embed.external", external };
  }

  async uploadImage(imageUrl, maxBytes) {
    const response = await this.fetch(imageUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`image HTTP ${response.status}`);
    const type = (response.headers.get("content-type") || "").split(";", 1)[0].trim();
    if (!type.startsWith("image/")) throw new Error(`not an image: ${type || "missing type"}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new Error(`image exceeds ${maxBytes} bytes`);
    const session = await this.authenticate();
    const upload = await this.fetch(`${this.serviceUrl}/xrpc/com.atproto.repo.uploadBlob`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessJwt}`, "Content-Type": type },
      body: bytes,
    });
    const payload = await upload.json().catch(() => null);
    if (!upload.ok || !payload?.blob) throw new Error(`image upload failed: HTTP ${upload.status}`);
    return payload.blob;
  }
}

async function reconcileTelegram(post, current, store, client) {
  if (current?.status === "published") return { failed: false, receipt: current };
  try {
    const receipt = await client.publish(post);
    await store.save(receiptPath(post.path, "telegram"), receipt);
    console.log(`Telegram: ${post.path} -> ${receipt.url}`);
    return { failed: false, receipt };
  } catch (error) {
    const receipt = {
      status: "failed",
      attempted_at: new Date().toISOString(),
      error: sanitizedError(error),
    };
    await store.save(receiptPath(post.path, "telegram"), receipt);
    console.error(`Telegram: ${post.path} failed: ${receipt.error}`);
    return { failed: true, receipt };
  }
}

async function reconcileBluesky(post, current, store, client) {
  if (current?.status === "published") return { failed: false, receipt: current };
  try {
    const published = await client.publish(post);
    const receipt = { status: "published", published_at: new Date().toISOString(), post: published };
    await store.save(receiptPath(post.path, "bluesky"), receipt);
    console.log(`Bluesky: ${post.path} -> ${published.url}`);
    return { failed: false, receipt };
  } catch (error) {
    const receipt = {
      status: "failed",
      attempted_at: new Date().toISOString(),
      error: sanitizedError(error),
    };
    await store.save(receiptPath(post.path, "bluesky"), receipt);
    console.error(`Bluesky: ${post.path} failed: ${receipt.error}`);
    return { failed: true, receipt };
  }
}

export async function reconcile({ root = process.cwd(), env = process.env, fetchImpl = fetch, store } = {}) {
  const siteBaseUrl = env.SITE_BASE_URL || "https://andysmith.ai";
  const candidates = [];
  for (const relativePath of await postPaths(root)) {
    const post = await loadPost(root, relativePath, siteBaseUrl);
    if (post) candidates.push(post);
  }
  candidates.sort((left, right) => left.date - right.date);

  const receiptStore = store || new GitHubReceiptStore({
    repository: env.GITHUB_REPOSITORY,
    branch: env.GITHUB_REF_NAME || "main",
    token: env.GITHUB_TOKEN,
    fetchImpl,
  });
  const telegram = new TelegramClient({
    token: env.TELEGRAM_BOT_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID,
    username: env.TELEGRAM_CHANNEL_USERNAME,
    fetchImpl,
  });
  const bluesky = new BlueskyClient({
    identifier: env.BLUESKY_IDENTIFIER,
    appPassword: env.BLUESKY_APP_PASSWORD,
    serviceUrl: env.BLUESKY_SERVICE_URL,
    fetchImpl,
  });

  let failed = false;
  for (const post of candidates) {
    const telegramReceipt = await loadReceipt(root, post.path, "telegram");
    const telegramResult = await reconcileTelegram(post, telegramReceipt, receiptStore, telegram);
    failed ||= telegramResult.failed;

    const blueskyReceipt = await loadReceipt(root, post.path, "bluesky");
    const blueskyResult = await reconcileBluesky(post, blueskyReceipt, receiptStore, bluesky);
    failed ||= blueskyResult.failed;
  }
  return { failed, candidates: candidates.length };
}

async function main() {
  const result = await reconcile();
  if (result.failed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

export {
  BlueskyClient,
  GitHubReceiptStore,
  TelegramClient,
  parseFrontmatter,
  publicPostUrl,
  receiptPath,
  reconcileBluesky,
  reconcileTelegram,
};
