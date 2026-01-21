# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for andysmith.ai built with Hugo static site generator using the Ananke theme.

All text in the repository must be written in English, regardless of what language the user gives commands in.

## Workflow

### New Blog Post (default)
When the user sends text without a command prefix:

**Optional instructions:** If the message ends with `---` followed by text, that text contains instructions to follow (title, image idea, tweet, etc.). Do not translate or include instructions in the post.

**Phase 1: Discuss**
1. Propose a title and image idea (skip if provided in instructions)
2. User approves or provides corrections → repeat until approved

**Phase 2: Create**
3. Translate text to English if needed
4. Create post in `content/blog/YYYY/MM/post-slug/index.md`
5. User uploads `image.png` from another device → run `git pull`, then `convert image.png -modulate 35 featured.png`
6. User approves or provides corrections → repeat until approved

**Phase 3: Publish**
7. Commit and push (without `twitter_discussion` link)
8. Provide post link: `https://andysmith.ai/blog/YYYY/MM/post-slug/`
9. Provide tweet text for user to post

**Phase 4: Link**
10. User publishes tweet and provides the URL
11. Add `twitter_discussion` to front matter, add `{{</* x */>}}` shortcode, commit and push

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

# Generate darkened featured image from user-provided image.png
convert image.png -modulate 35 featured.png
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
images: ["image.png"]
twitter_discussion: "https://x.com/andysmith_ai/status/..."
---
```

**Date must be current datetime** — ALWAYS run `date +"%Y-%m-%dT%H:%M:%S"` to get the actual time before creating a post. Never guess or make up the time. Future dates prevent publication.

## Tweet Text

When writing tweet text in Phase 3:
1. **Keep the main idea** — if the user provided a tweet idea in instructions, preserve its core message
2. **Expand to 280 chars** — fill the available space with supporting thoughts from the post
3. **Standalone clarity** — the tweet must make sense without reading the post
4. **No summary jumble** — expand on one idea, don't cram unrelated points

## Twitter Discussion

To add a "Discuss on X" link at the end of a post:

1. Add `twitter_discussion` URL to front matter (see above)
2. Add `{{</* x */>}}` shortcode at the end of the post content

The shortcode only renders if `twitter_discussion` is set.

## Featured Image

User uploads `image.png` to the post folder from another device. After upload:
1. Run `git pull` to fetch the image
2. Run `convert image.png -modulate 35 featured.png` to create darkened version for title overlay

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
