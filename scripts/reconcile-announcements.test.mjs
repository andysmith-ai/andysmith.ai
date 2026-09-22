import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  BlueskyClient,
  TelegramClient,
  reconcile,
  reconcileBluesky,
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

function jsonResponse(value, status = 200) {
  return Response.json(value, { status });
}

test("Telegram sends a simple announcement without a preview card", async () => {
  let request;
  const client = new TelegramClient({
    token: "secret-token",
    chatId: "@andysmith_ai",
    username: "andysmith_ai",
    fetchImpl: async (url, init) => {
      request = { url, payload: JSON.parse(init.body) };
      return jsonResponse({ ok: true, result: { message_id: 42 } });
    },
  });

  const receipt = await client.publish(post);

  assert.equal(request.url, "https://api.telegram.org/botsecret-token/sendMessage");
  assert.equal(request.payload.parse_mode, "HTML");
  assert.equal(request.payload.link_preview_options.is_disabled, true);
  assert.match(request.payload.text, /^<b>Example &lt;Post&gt;<\/b>/);
  assert.match(request.payload.text, /Telegram &lt;announcement&gt;\./);
  assert.match(request.payload.text, /https:\/\/andysmith\.ai\/2026\/Sep\/22\/example\/$/);
  assert.equal(receipt.url, "https://t.me/andysmith_ai/42");
});

test("Bluesky publishes an announcement root and a URL-only self-reply", async () => {
  const records = [];
  let recordNumber = 0;
  const client = new BlueskyClient({
    identifier: "author.example",
    appPassword: "app-password",
    fetchImpl: async (url, init) => {
      if (url.endsWith("com.atproto.server.createSession")) {
        return jsonResponse({ accessJwt: "jwt", did: "did:plc:author", handle: "author.example" });
      }
      const payload = JSON.parse(init.body);
      records.push(payload.record);
      recordNumber += 1;
      return jsonResponse({
        uri: `at://did:plc:author/app.bsky.feed.post/record-${recordNumber}`,
        cid: `cid-${recordNumber}`,
      });
    },
  });

  const root = await client.publishRoot(post);
  const link = await client.publishLink(post, root);

  assert.equal(records[0].text, "Bluesky announcement.");
  assert.equal(records[0].embed, undefined);
  assert.equal(records[1].text, post.url);
  assert.equal(records[1].embed, undefined);
  assert.deepEqual(records[1].reply, {
    root: { uri: root.uri, cid: root.cid },
    parent: { uri: root.uri, cid: root.cid },
  });
  assert.deepEqual(records[1].facets[0], {
    index: { byteStart: 0, byteEnd: new TextEncoder().encode(post.url).byteLength },
    features: [{ $type: "app.bsky.richtext.facet#link", uri: post.url }],
  });
  assert.equal(link.url, "https://bsky.app/profile/author.example/post/record-2");
});

test("Bluesky reconciliation resumes only the missing link reply", async () => {
  const root = {
    uri: "at://did:plc:author/app.bsky.feed.post/root",
    cid: "root-cid",
    url: "https://bsky.app/profile/author.example/post/root",
  };
  let rootCalls = 0;
  let linkCalls = 0;
  const client = {
    async publishRoot() {
      rootCalls += 1;
      return root;
    },
    async publishLink(_post, actualRoot) {
      linkCalls += 1;
      assert.deepEqual(actualRoot, root);
      return {
        uri: "at://did:plc:author/app.bsky.feed.post/link",
        cid: "link-cid",
        url: "https://bsky.app/profile/author.example/post/link",
      };
    },
  };
  const writes = [];
  const store = { async save(filePath, receipt) { writes.push({ filePath, receipt }); } };

  const result = await reconcileBluesky(post, { status: "partial", root }, store, client);

  assert.equal(result.failed, false);
  assert.equal(rootCalls, 0);
  assert.equal(linkCalls, 1);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].filePath, "src/2026/Sep/22/example/bluesky.json");
  assert.equal(writes[0].receipt.status, "published");
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
  let blueskyRecord = 0;
  const fetchImpl = async (url, init) => {
    if (url.includes("api.telegram.org")) {
      return jsonResponse({ ok: true, result: { message_id: 7 } });
    }
    if (url.endsWith("com.atproto.server.createSession")) {
      return jsonResponse({ accessJwt: "jwt", did: "did:plc:author", handle: "author.example" });
    }
    if (url.endsWith("com.atproto.repo.createRecord")) {
      blueskyRecord += 1;
      return jsonResponse({
        uri: `at://did:plc:author/app.bsky.feed.post/${blueskyRecord}`,
        cid: `cid-${blueskyRecord}`,
      });
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
    ["src/2026/Sep/22/example/bluesky.json", "partial"],
    ["src/2026/Sep/22/example/bluesky.json", "published"],
  ]);
});
