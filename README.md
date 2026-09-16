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

