# andysmith.ai

Minimal blog built with [Eleventy](https://www.11ty.dev/). Blog only, classless
[water.css](https://watercss.kognise.dev/) styling, light/dark automatic. Text
navigation only — no navbar.

## Structure

```
src/
  index.njk                 home page — reverse-chronological list of posts
  _includes/
    base.njk                <html> shell, meta/OG tags, top + bottom nav
    post.njk                single-post layout (title · date · content)
    nav.njk                 the [home] [x] [github] text nav
  _data/site.js             site url / title / author
  blog/
    blog.11tydata.js        applies the post layout to every post
    <year>/<month>/<slug>/
      index.md              post (Hugo-style page bundle, frontmatter + body)
      image.png / *.jpeg    body / og images
  assets/
    water.css               vendored library — pristine, replace wholesale on update
    custom.css              site overrides (nav styling) — kept separate from the lib
eleventy.config.js          build config
flake.nix                   nix devshell (Node 22)
```

Post URLs mirror the folder path: `src/blog/2026/01/everything-is-text/index.md`
→ `/blog/2026/01/everything-is-text/`.

## Develop

```sh
nix develop -c npm install      # first time
nix develop -c npm run serve    # dev server with live reload
nix develop -c npm run build    # production build -> _site/
```

## Content

The post set matches the currently-deployed bare-HTML site (`andysmith-ai.github.io`)
exactly — 25 posts, verified text-identical. Sourcing:

- 24 posts: clean markdown from the `content` repo (`content/blog/`).
- `2026/05/lazy-mcp-dispatch-and-discovery`: existed only on the live HTML site
  (never in `content`); recovered back to markdown from the deployed HTML.
- Three stale April posts present in `content` but deliberately removed from the
  live site (junk) are **not** included.

Frontmatter used: `title`, `date`, `description`, `featured_image` (→ og:image only,
not shown inline). Links to other content types (`../../cards/*.md`) are stripped to
plain text at build time since this site publishes the blog only.

`old/` holds the original repos (both `content` mirrors, Astro site, Hugo site,
deployed github.io) for reference and is not part of the build.

## Announcement publishing

New posts may include channel-specific announcement text:

```yaml
announcements:
  telegram: "Telegram-specific announcement."
  bluesky: "Bluesky-specific announcement."
```

`.github/workflows/reconcile-announcements.yml` publishes eligible posts
oldest-first:

- Telegram, regular post: bold title, announcement, and the canonical URL. If
  the post contains an image, the first one is shown as a large link preview
  below the text; otherwise link previews are disabled.
- Telegram, link post (`link` in frontmatter): the external link preview above
  the text, the announcement, and the canonical URL. No title and no post image.
- Bluesky: one post containing the announcement followed by `→`; the arrow
  links to the canonical URL, so the announcement plus ` →` must fit in 300
  characters. A regular post attaches its first image (up to 2,000,000 bytes,
  with its alt text); if the image cannot be uploaded the post goes out without
  it. A link post instead carries an external link card for `link`, built from
  the linked page's `og:title`, `og:description`, and `og:image` (thumbnail up
  to 1,000,000 bytes). If the page is unavailable the card falls back to the
  post title without a thumbnail.

Each Channel stores its result beside `index.md` in `telegram.json` or
`bluesky.json`. Existing posts without `announcements` are ignored. Failed
receipts are retried when another post triggers the workflow or when the
workflow is dispatched manually.

### Configure GitHub Actions

Open **Repository Settings → Secrets and variables → Actions**. Add values at
the repository level; no deployment environment is required.

Secrets:

| Name | Value |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Token issued by Telegram's `@BotFather`. |
| `BLUESKY_APP_PASSWORD` | A dedicated Bluesky app password. Never use the account's primary password. |

Variables:

| Name | Value |
| --- | --- |
| `TELEGRAM_CHAT_ID` | The target public channel username with `@`, for example `@channel_name`, or its numeric chat ID. |
| `TELEGRAM_CHANNEL_USERNAME` | The target public channel username used to construct receipt URLs, for example `channel_name`. |
| `BLUESKY_IDENTIFIER` | The publishing account's handle, for example `name.bsky.social`. |
| `BLUESKY_SERVICE_URL` | Optional Personal Data Server URL. Omit it to use `https://bsky.social`. |

`GITHUB_TOKEN` is supplied automatically by GitHub Actions. Do not create a
repository secret with that name. Under **Repository Settings → Actions →
General → Workflow permissions**, allow the workflow to write repository
contents; it commits Channel Receipt files beside each Post.

### Configure Telegram

1. Open Telegram's verified `@BotFather` account.
2. Run `/newbot`, complete the prompts, and copy the issued token into the
   `TELEGRAM_BOT_TOKEN` repository secret.
3. Add the bot to the target public channel as an administrator with permission
   to post messages.
4. Set `TELEGRAM_CHAT_ID` and `TELEGRAM_CHANNEL_USERNAME` as described above.

The channel must have a public username because successful Telegram receipts
store a public `https://t.me/<username>/<message-id>` URL.

### Configure Bluesky

1. Sign in to the publishing Bluesky account.
2. Open **Settings → Advanced → App Passwords**.
3. Create a dedicated app password named for this site and copy it immediately
   into the `BLUESKY_APP_PASSWORD` repository secret.
4. Put the account handle in the `BLUESKY_IDENTIFIER` repository variable.
5. Leave `BLUESKY_SERVICE_URL` unset for the default Bluesky service. Set it
   only when the account uses another Personal Data Server.

### Verify announcement publishing

Open **Actions → Reconcile announcements → Run workflow**. The workflow should
finish successfully. For an eligible Post, verify:

1. Telegram contains the title, Telegram Announcement, and canonical URL with
   no link preview.
2. Bluesky contains the Bluesky Announcement as the root post and a URL-only
   self-reply.
3. The Post directory contains `telegram.json` and `bluesky.json` receipts on
   `main`.

The workflow processes every eligible unreceipted Post, not just the newest
one. Configure both Channels before the first manual run.

