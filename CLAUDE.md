# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for andysmith.ai built with Hugo static site generator using the Ananke theme.

All text in the repository must be written in English, regardless of what language the user gives commands in.

## Workflow

### New Blog Post (default)
When the user sends text without a command prefix:

**Phase 1: Discuss**
1. Propose a title and image idea (do not create files yet)
2. User approves or provides corrections → repeat until approved

**Phase 2: Create**
3. Translate text to English if needed
4. Create post in `content/blog/YYYY/MM/post-slug/index.md`
5. Create `featured.txt` with ASCII art, generate `featured.png`
6. User approves or provides corrections → repeat until approved

**Phase 3: Publish**
7. Commit and push (without `twitter_discussion` link)
8. Provide tweet text for user to post

**Phase 4: Link**
9. User publishes tweet and provides the URL
10. Add `twitter_discussion` to front matter, add `{{</* x */>}}` shortcode, commit and push

### Update Instructions (`/claude`)
When the user starts message with `/claude`:
1. Apply changes to CLAUDE.md (user approves via edit permission)
2. Commit and push

## Commands

```bash
# Local development server
hugo server

# Build for production
hugo --gc --minify

# Create new post (creates draft by default)
hugo new content/blog/YYYY/MM/post-slug/index.md

# Generate featured image from ASCII art (auto-pads to 2:1 aspect ratio)
cat featured.txt | scripts/ascii2png featured.png
```

## Content Structure

Posts are organized by date: `content/blog/YYYY/MM/post-slug/index.md`

Each post uses YAML front matter:
```yaml
---
title: Post Title
description: Brief summary for SEO and social sharing
date: YYYY-MM-DDTHH:MM:SS
featured_image: featured.png
images: ["featured.png"]
twitter_discussion: "https://x.com/andysmith_ai/status/..."
---
```

**Date must be current datetime** — use the actual time when creating the post. Future dates prevent publication.

## Tweet Text

When writing tweet text in Phase 3:
1. **One main idea** — extract the single most important takeaway from the post
2. **Standalone clarity** — the tweet must make sense without reading the post
3. **No summary jumble** — don't cram multiple points from the post into one tweet

## Twitter Discussion

To add a "Discuss on X" link at the end of a post:

1. Add `twitter_discussion` URL to front matter (see above)
2. Add `{{</* x */>}}` shortcode at the end of the post content

The shortcode only renders if `twitter_discussion` is set.

## Featured Image Requirements

ASCII art in `featured.txt` should follow these rules:
1. **One recognizable image** related to the post topic (can be abstract or stylized text)
2. **No regular text** — only block-character art (title will be overlaid)
3. **Large simple shapes** — readable even as thumbnail
4. **Use block characters** — █, ▄, ▀, ▓, ▒, ░, ╔, ╗, ║, ═, etc.
5. **Gradients welcome** — ░▒▓█ for depth and texture
6. **Left-align to widest line** — no leading spaces on the widest line (pango-view adds margins; extra leading spaces shift the image right)
7. **No background fill** — draw only the shape itself, don't fill empty space with ░ or other characters

Good examples:
- Stylized text: "TXT", "HI", "KISS" in block letters
- Icons: rocket, fortress, org chart
- Abstract shapes with gradients

## Writing Style

1. **Em-dashes with spaces** — always add spaces before and after em-dashes (—)
2. **Use dashes sparingly** — overusing em-dashes is a telltale sign of AI-generated text; prefer periods and commas for natural flow

## Deployment

Automatic via GitHub Actions on push to main. The workflow builds with Hugo and deploys to GitHub Pages.

## Theme

Ananke theme is included as a git submodule. After cloning, run:
```bash
git submodule update --init --recursive
```
