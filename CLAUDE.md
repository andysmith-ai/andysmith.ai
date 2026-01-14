# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for andysmith.ai built with Hugo static site generator using the Ananke theme.

All text in the repository must be written in English, regardless of what language the user gives commands in.

## Workflow

### New Blog Post (default)
When the user sends text without a command prefix:
1. Translate to English if needed
2. Create post in `content/blog/YYYY/MM/post-slug/index.md` (user approves via edit permission)
3. Create `featured.txt` with ASCII art and show it to user
4. Generate `featured.png` using `scripts/ascii2png`
5. Add `featured_image: featured.png` to front matter
6. Commit, push, reply with X.com announcement

If user rejects edit → they provide corrections → repeat

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

# Generate featured image from ASCII art
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
---
```

## Deployment

Automatic via GitHub Actions on push to main. The workflow builds with Hugo and deploys to GitHub Pages.

## Theme

Ananke theme is included as a git submodule. After cloning, run:
```bash
git submodule update --init --recursive
```
