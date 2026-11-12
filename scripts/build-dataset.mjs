import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { commit, downloadFile, listFiles } from "@huggingface/hub";
import { parquetWriteBuffer } from "hyparquet-writer";
import { parseFrontmatter, postPaths, publicPostUrl } from "./reconcile-announcements.mjs";

const SITE_BASE_URL = "https://andysmith.ai";
const DATASET_REPO = { type: "dataset", name: "andy-smith-ai/Posts" };
const CARD_SOURCE = "dataset/README.md";
const LOCAL_OUT = "_dataset";

const string = (name, repetition_type = "REQUIRED") => ({ name, type: "BYTE_ARRAY", converted_type: "UTF8", repetition_type });
const list = (name, children) => [
  { name, repetition_type: "REQUIRED", converted_type: "LIST", num_children: 1 },
  { name: "list", repetition_type: "REPEATED", num_children: 1 },
  ...children,
];

/** Parquet schema of one row; Arrow-style 3-level lists so every reader agrees on nesting. */
const ROW_SCHEMA = [
  { name: "schema", num_children: 9 },
  string("id"),
  string("platform"),
  string("url"),
  string("published_at"),
  string("title", "OPTIONAL"),
  string("text"),
  string("link", "OPTIONAL"),
  ...list("media", [
    { name: "element", repetition_type: "REQUIRED", num_children: 3 },
    string("type"),
    string("url"),
    string("text", "OPTIONAL"),
  ]),
  ...list("tags", [string("element")]),
];
const ROW_FIELDS = ["id", "platform", "url", "published_at", "title", "text", "link", "media", "tags"];

function parquet(rows) {
  const columnData = ROW_FIELDS.map((name) => ({ name, data: rows.map((row) => row[name]) }));
  return new Uint8Array(parquetWriteBuffer({ columnData, schema: ROW_SCHEMA }));
}

// A lightbox wrapper around an image: keep only the image.
const LIGHTBOX = /<a\b[^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi;
const HTML_IMAGE = /<img\b[^>]*>/gi;
const MARKDOWN_TARGET = /(\]\(\s*<?)([^)\s>]+)/g;
const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)/g;
const ABSOLUTE = /^[a-z][a-z\d+.-]*:/i;

function attribute(tag, name) {
  return new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i").exec(tag)?.[1];
}

/** YAML timestamps without an offset are UTC, as Eleventy renders them. */
function utcTimestamp(value, postPath) {
  const raw = value instanceof Date ? value.toISOString() : String(value);
  const date = new Date(/T.*([zZ]|[+-]\d{2}:?\d{2})$|^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : `${raw}Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`${postPath}: valid date is required`);
  return date.toISOString();
}

/** Post body as portable Markdown: HTML images become Markdown, relative URLs absolute. */
function portableMarkdown(body, url) {
  return body
    .replace(LIGHTBOX, "$1")
    .replace(HTML_IMAGE, (tag) => `![${attribute(tag, "alt") ?? ""}](${attribute(tag, "src")})`)
    .replace(MARKDOWN_TARGET, (match, prefix, target) => (ABSOLUTE.test(target) ? match : `${prefix}${new URL(target, url).href}`));
}

function media(text, featuredImage, url) {
  const images = Array.from(text.matchAll(MARKDOWN_IMAGE), ([, alt, src]) => ({ type: "image", url: src, text: alt.trim() || null }));
  if (featuredImage) {
    const featured = new URL(featuredImage, url).href;
    if (!images.some((image) => image.url === featured)) images.unshift({ type: "image", url: featured, text: null });
  }
  return images;
}

async function siteRow(root, postPath) {
  const { data, body } = parseFrontmatter(await readFile(path.join(root, postPath), "utf8"));
  const url = publicPostUrl(postPath, SITE_BASE_URL);
  const text = portableMarkdown(body, url);
  const link = typeof data.link === "string" && data.link.trim() ? data.link.trim() : null;
  return {
    id: `site:${postPath.replace(/^src\//, "").replace(/\/index\.md$/, "")}`,
    platform: "site",
    url,
    published_at: utcTimestamp(data.date, postPath),
    title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : null,
    text,
    link,
    media: media(text, typeof data.featured_image === "string" ? data.featured_image : null, url),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

/** The complete dataset repository content, keyed by repository path. */
export async function buildDataset(root = process.cwd()) {
  const rows = await Promise.all((await postPaths(root)).map((postPath) => siteRow(root, postPath)));
  rows.sort((a, b) => a.published_at.localeCompare(b.published_at) || a.id.localeCompare(b.id));
  return {
    "README.md": new TextEncoder().encode(await readFile(path.join(root, CARD_SOURCE), "utf8")),
    "data/site.parquet": parquet(rows),
  };
}

/**
 * Uploads changed files and deletes data files the build no longer produces, in one commit;
 * an unchanged dataset produces no commit.
 */
async function publish(files, accessToken) {
  const operations = [];
  for (const [repoPath, content] of Object.entries(files)) {
    const current = await downloadFile({ repo: DATASET_REPO, path: repoPath, accessToken });
    if (!current || !Buffer.from(await current.arrayBuffer()).equals(content)) {
      operations.push({ operation: "addOrUpdate", path: repoPath, content: new Blob([content]) });
    }
  }
  for await (const entry of listFiles({ repo: DATASET_REPO, path: "data", recursive: true, accessToken })) {
    if (entry.type === "file" && !(entry.path in files)) operations.push({ operation: "delete", path: entry.path });
  }
  if (!operations.length) {
    console.log("dataset unchanged");
    return;
  }
  await commit({
    repo: DATASET_REPO,
    accessToken,
    title: `Rebuild from andysmith.ai@${process.env.GITHUB_SHA?.slice(0, 7) ?? "local"}`,
    operations,
  });
  for (const { operation, path: repoPath } of operations) console.log(`${operation === "delete" ? "deleted" : "uploaded"} ${repoPath}`);
}

async function main() {
  const files = await buildDataset();
  if (process.argv.includes("--publish")) {
    const token = process.env.HF_TOKEN;
    if (!token) throw new Error("HF_TOKEN is required to publish");
    await publish(files, token);
    return;
  }
  for (const [repoPath, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(LOCAL_OUT, repoPath)), { recursive: true });
    await writeFile(path.join(LOCAL_OUT, repoPath), content);
  }
  console.log(`wrote ${Object.keys(files).join(", ")} to ${LOCAL_OUT}/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
