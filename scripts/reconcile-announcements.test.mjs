import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  BlueskyClient,
  TelegramClient,
  reconcile,
  reconcileTelegram,
} from "./reconcile-announcements.mjs";

const post = {
  path: "src/2026/Sep/22/example/index.md",
  title: "Example <Post>",
  date: new Date("2026-09-22T12:00:00Z"),
  url: "https://andysmith.ai/2026/Sep/22/example/",
  announcements: {
    telegram: "Telegram <announcement>.",
    bluesky: "Bluesky announcement.",
  },
};

const linkPost = { ...post, link: "https://github.com/coldteadotai/pr-lens" };
const imagePost = { ...post, image: { url: "https://files.andysmith.ai/img/a/photo.webp", alt: "photo" } };

function jsonResponse(value, status = 200) {
  return Response.json(value, { status });
}

function telegramHarness() {
  const requests = [];
  const client = new TelegramClient({
    token: "secret-token",
    chatId: "@andysmith_ai",
    username: "andysmith_ai",
    fetchImpl: async (url, init) => {
      requests.push({ url, payload: JSON.parse(init.body) });
      return jsonResponse({ ok: true, result: { message_id: 42 } });
    },
  });
  return { client, requests };
}

function blueskyHarness(pages = {}) {
  const records = [];
  const uploads = [];
  const requestUrls = [];
  const fetchImpl = async (url, init = {}) => {
    requestUrls.push(url);
    if (url.endsWith("com.atproto.server.createSession")) {
      return jsonResponse({ accessJwt: "jwt", did: "did:plc:author", handle: "author.example" });
    }
    if (url.endsWith("com.atproto.repo.uploadBlob")) {
      const mimeType = init.headers["Content-Type"];
      uploads.push({ mimeType, size: init.body.byteLength });
      return jsonResponse({ blob: { $type: "blob", ref: { $link: "thumb-cid" }, mimeType, size: init.body.byteLength } });
    }
    if (url.endsWith("com.atproto.repo.createRecord")) {
      records.push(JSON.parse(init.body).record);
      return jsonResponse({
        uri: `at://did:plc:author/app.bsky.feed.post/record-${records.length}`,
        cid: `cid-${records.length}`,
      });
    }
    if (url in pages) return pages[url]();
    throw new Error(`unexpected request: ${url}`);
  };
  const client = new BlueskyClient({ identifier: "author.example", appPassword: "app-password", serviceUrl: "", fetchImpl });
  return { client, records, uploads, requestUrls };
}

test("Telegram sends a regular announcement with its title and without a preview card", async () => {
  const { client, requests } = telegramHarness();

  const receipt = await client.publish(post);

  const [request] = requests;
  assert.equal(request.url, "https://api.telegram.org/botsecret-token/sendMessage");
  assert.equal(request.payload.parse_mode, "HTML");
  assert.deepEqual(request.payload.link_preview_options, { is_disabled: true });
  assert.match(request.payload.text, /^<b>Example &lt;Post&gt;<\/b>/);
  assert.match(request.payload.text, /Telegram &lt;announcement&gt;\./);
  assert.match(request.payload.text, /https:\/\/andysmith\.ai\/2026\/Sep\/22\/example\/$/);
  assert.equal(receipt.url, "https://t.me/andysmith_ai/42");
});

test("Telegram shows a link post's external preview above the text instead of a title", async () => {
  const { client, requests } = telegramHarness();

  await client.publish(linkPost);

  const [request] = requests;
  assert.equal(request.payload.text, "Telegram &lt;announcement&gt;.\n\nhttps://andysmith.ai/2026/Sep/22/example/");
  assert.deepEqual(request.payload.link_preview_options, { url: linkPost.link, show_above_text: true });
});

test("Telegram shows a regular post's image as a large preview below the text", async () => {
  const { client, requests } = telegramHarness();

  await client.publish(imagePost);

  const [request] = requests;
  assert.match(request.payload.text, /^<b>Example &lt;Post&gt;<\/b>/);
  assert.deepEqual(request.payload.link_preview_options, {
    url: imagePost.image.url,
    prefer_large_media: true,
    show_above_text: false,
  });
});

test("Bluesky publishes one post whose trailing arrow links to the site post", async () => {
  const { client, records, requestUrls } = blueskyHarness();
  const quoted = { ...post, announcements: { ...post.announcements, bluesky: "Bluesky “announcement”." } };

  const published = await client.publish(quoted);

  assert.equal(records.length, 1);
  const [record] = records;
  assert.equal(record.text, "Bluesky “announcement”. →");
  assert.equal(record.reply, undefined);
  assert.equal(record.embed, undefined);
  const { byteStart, byteEnd } = record.facets[0].index;
  assert.equal(Buffer.from(record.text).subarray(byteStart, byteEnd).toString(), "→");
  assert.deepEqual(record.facets[0].features, [{ $type: "app.bsky.richtext.facet#link", uri: post.url }]);
  assert.ok(requestUrls.every((url) => url.startsWith("https://bsky.social/")));
  assert.equal(published.url, "https://bsky.app/profile/author.example/post/record-1");
});

test("Bluesky attaches an external card built from the linked page", async () => {
  const html = [
    "<html><head><title>Fallback title</title>",
    '<meta property="og:title" content="coldteadotai/pr-lens">',
    '<meta content="Visualize &amp; review PRs" property="og:description">',
    '<meta property="og:image" content="/card.png">',
    "</head></html>",
  ].join("");
  const { client, records, uploads } = blueskyHarness({
    [linkPost.link]: () => new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }),
    "https://github.com/card.png": () => new Response(Uint8Array.from([1, 2, 3]), { headers: { "content-type": "image/png" } }),
  });

  await client.publish(linkPost);

  assert.deepEqual(uploads, [{ mimeType: "image/png", size: 3 }]);
  assert.deepEqual(records[0].embed, {
    $type: "app.bsky.embed.external",
    external: {
      uri: linkPost.link,
      title: "coldteadotai/pr-lens",
      description: "Visualize & review PRs",
      thumb: { $type: "blob", ref: { $link: "thumb-cid" }, mimeType: "image/png", size: 3 },
    },
  });
});

test("Bluesky keeps page metadata but drops a thumbnail over 1,000,000 bytes", async () => {
  const html = '<meta property="og:title" content="Big"><meta property="og:image" content="https://example.com/big.png">';
  const { client, records, uploads } = blueskyHarness({
    [linkPost.link]: () => new Response(html, { headers: { "content-type": "text/html" } }),
    "https://example.com/big.png": () => new Response(new Uint8Array(1_000_001), { headers: { "content-type": "image/png" } }),
  });

  await client.publish(linkPost);

  assert.deepEqual(uploads, []);
  assert.deepEqual(records[0].embed.external, { uri: linkPost.link, title: "Big", description: "" });
});

test("Bluesky still publishes a link post when the linked page is unavailable", async () => {
  const { client, records } = blueskyHarness({
    [linkPost.link]: () => new Response("unavailable", { status: 503 }),
  });

  await client.publish(linkPost);

  assert.equal(records.length, 1);
  assert.deepEqual(records[0].embed.external, { uri: linkPost.link, title: post.title, description: "" });
});

test("Bluesky attaches a regular post's image with its alt text", async () => {
  const { client, records, uploads } = blueskyHarness({
    [imagePost.image.url]: () => new Response(Uint8Array.from([1, 2]), { headers: { "content-type": "image/webp" } }),
  });

  await client.publish(imagePost);

  assert.deepEqual(uploads, [{ mimeType: "image/webp", size: 2 }]);
  assert.deepEqual(records[0].embed, {
    $type: "app.bsky.embed.images",
    images: [{ image: { $type: "blob", ref: { $link: "thumb-cid" }, mimeType: "image/webp", size: 2 }, alt: "photo" }],
  });
});

test("Bluesky publishes without the image when it cannot be uploaded", async () => {
  const { client, records } = blueskyHarness({
    [imagePost.image.url]: () => new Response(new Uint8Array(2_000_001), { headers: { "content-type": "image/webp" } }),
  });

  await client.publish(imagePost);

  assert.equal(records.length, 1);
  assert.equal(records[0].embed, undefined);
});

test("a Telegram failure is persisted instead of escaping the reconciler", async () => {
  const client = { async publish() { throw new Error("temporary rejection"); } };
  const writes = [];
  const store = { async save(filePath, receipt) { writes.push({ filePath, receipt }); } };

  const result = await reconcileTelegram(post, null, store, client);

  assert.equal(result.failed, true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].filePath, "src/2026/Sep/22/example/telegram.json");
  assert.equal(writes[0].receipt.status, "failed");
  assert.equal(writes[0].receipt.error, "temporary rejection");
});

test("reconciliation publishes only posts with announcement fields", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "announcement-reconciler-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const eligibleDirectory = path.join(root, "src/2026/Sep/22/example");
  const legacyDirectory = path.join(root, "src/2026/Sep/21/legacy");
  await mkdir(eligibleDirectory, { recursive: true });
  await mkdir(legacyDirectory, { recursive: true });
  await writeFile(path.join(eligibleDirectory, "index.md"), [
    "---",
    'title: "Example"',
    "date: 2026-09-22T12:00:00Z",
    "announcements:",
    '  telegram: "Telegram announcement."',
    '  bluesky: "Bluesky announcement."',
    "---",
    "",
    "Body.",
    "",
  ].join("\n"));
  await writeFile(path.join(legacyDirectory, "index.md"), [
    "---",
    'title: "Legacy"',
    "date: 2026-09-21T12:00:00Z",
    "---",
    "",
    "Body.",
    "",
  ].join("\n"));

  const writes = [];
  const store = { async save(filePath, receipt) { writes.push({ filePath, receipt }); } };
  const fetchImpl = async (url, init) => {
    if (url.includes("api.telegram.org")) {
      return jsonResponse({ ok: true, result: { message_id: 7 } });
    }
    if (url.endsWith("com.atproto.server.createSession")) {
      return jsonResponse({ accessJwt: "jwt", did: "did:plc:author", handle: "author.example" });
    }
    if (url.endsWith("com.atproto.repo.createRecord")) {
      return jsonResponse({ uri: "at://did:plc:author/app.bsky.feed.post/1", cid: "cid-1" });
    }
    throw new Error(`unexpected request: ${url} ${init?.method || "GET"}`);
  };

  const result = await reconcile({
    root,
    store,
    fetchImpl,
    env: {
      SITE_BASE_URL: "https://andysmith.ai",
      TELEGRAM_BOT_TOKEN: "token",
      TELEGRAM_CHAT_ID: "@andysmith_ai",
      TELEGRAM_CHANNEL_USERNAME: "andysmith_ai",
      BLUESKY_IDENTIFIER: "author.example",
      BLUESKY_APP_PASSWORD: "password",
    },
  });

  assert.deepEqual(result, { failed: false, candidates: 1 });
  assert.deepEqual(writes.map((write) => [write.filePath, write.receipt.status]), [
    ["src/2026/Sep/22/example/telegram.json", "published"],
    ["src/2026/Sep/22/example/bluesky.json", "published"],
  ]);
});

test("reconciliation previews a post's first image but gives link posts their link instead", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "announcement-reconciler-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const write = async (directory, frontmatter, body) => {
    await mkdir(path.join(root, directory), { recursive: true });
    await writeFile(path.join(root, directory, "index.md"), ["---", ...frontmatter, "announcements:",
      '  telegram: "Announcement."', '  bluesky: "Announcement."', "---", "", body, ""].join("\n"));
  };
  await write("src/2026/Sep/22/photo", ['title: "Photo"', "date: 2026-09-22T12:00:00Z"],
    '<a class="lightbox" href="https://files.andysmith.ai/img/a/photo.png"><img src="photo.webp" alt="A &amp; B"></a>\n\nText.');
  await write("src/2026/Sep/23/linked", ['title: "Linked"', "type: link", "link: https://example.com/project", "date: 2026-09-23T12:00:00Z"],
    "![shot](https://files.andysmith.ai/img/b/shot.png)\n\nComment.");

  const telegramPayloads = [];
  const blueskyRecords = [];
  const requestedUrls = [];
  const fetchImpl = async (url, init = {}) => {
    requestedUrls.push(url);
    if (url.includes("api.telegram.org")) {
      telegramPayloads.push(JSON.parse(init.body));
      return jsonResponse({ ok: true, result: { message_id: 7 } });
    }
    if (url.endsWith("com.atproto.server.createSession")) {
      return jsonResponse({ accessJwt: "jwt", did: "did:plc:author", handle: "author.example" });
    }
    if (url.endsWith("com.atproto.repo.uploadBlob")) return jsonResponse({ blob: { $type: "blob" } });
    if (url.endsWith("com.atproto.repo.createRecord")) {
      blueskyRecords.push(JSON.parse(init.body).record);
      return jsonResponse({ uri: "at://did:plc:author/app.bsky.feed.post/1", cid: "cid-1" });
    }
    if (url === "https://andysmith.ai/2026/Sep/22/photo/photo.webp") {
      return new Response(Uint8Array.from([1]), { headers: { "content-type": "image/webp" } });
    }
    if (url === "https://example.com/project") return new Response("unavailable", { status: 503 });
    throw new Error(`unexpected request: ${url}`);
  };

  const result = await reconcile({
    root,
    store: { async save() {} },
    fetchImpl,
    env: {
      SITE_BASE_URL: "https://andysmith.ai",
      TELEGRAM_BOT_TOKEN: "token",
      TELEGRAM_CHAT_ID: "@andysmith_ai",
      TELEGRAM_CHANNEL_USERNAME: "andysmith_ai",
      BLUESKY_IDENTIFIER: "author.example",
      BLUESKY_APP_PASSWORD: "password",
    },
  });

  assert.deepEqual(result, { failed: false, candidates: 2 });
  assert.deepEqual(telegramPayloads.map((payload) => payload.link_preview_options), [
    { url: "https://andysmith.ai/2026/Sep/22/photo/photo.webp", prefer_large_media: true, show_above_text: false },
    { url: "https://example.com/project", show_above_text: true },
  ]);
  assert.equal(blueskyRecords[0].embed.images[0].alt, "A & B");
  assert.equal(blueskyRecords[1].embed.$type, "app.bsky.embed.external");
  assert.ok(!requestedUrls.includes("https://files.andysmith.ai/img/b/shot.png"));
});
