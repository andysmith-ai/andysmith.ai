# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for andysmith.ai built with Hugo static site generator using the Ananke theme.

All text in the repository must be written in English, regardless of what language the user gives commands in.

## Workflow

When the user sends a text without additional instructions, treat it as a new blog post:
1. Translate to English if needed
2. Create a new post in `content/YYYY/MM/post-slug/index.md` with current date
3. Reply with an X.com announcement text including the link (https://andysmith.ai/YYYY/MM/post-slug/)
4. Wait for user review - do not commit yet
5. If user sends edits, update the post and send a new X.com announcement
6. Commit only when user approves (e.g., "ok")

## Commands

```bash
# Local development server
hugo server

# Build for production
hugo --gc --minify

# Create new post (creates draft by default)
hugo new content/YYYY/MM/post-slug/index.md
```

## Content Structure

Posts are organized by date: `content/YYYY/MM/post-slug/index.md`

Each post uses YAML front matter:
```yaml
---
title: Post Title
date: YYYY-MM-DD
---
```

## Deployment

Automatic via GitHub Actions on push to main. The workflow builds with Hugo and deploys to GitHub Pages.

## Theme

Ananke theme is included as a git submodule. After cloning, run:
```bash
git submodule update --init --recursive
```
