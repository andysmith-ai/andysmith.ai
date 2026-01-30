---
title: "Short Sessions Beat Long Ones in Claude Code"
description: "Why keeping Claude Code sessions short and saving context to persistent storage is more efficient than running everything in one endless session."
date: 2026-01-30T07:26:16
featured_image: featured.png
images: ["image.png"]
---

When actively using Claude Code in manual mode, I always apply the same technique. I keep sessions as short as possible. I set a task, get the result, close the chat. If I realize I need to return to the task to clarify something, I do so via `claude -r`.

This workflow creates a need to save information between contexts. At the end of each session, I ask Claude to summarize and format a short summary of the session outcomes, which I then publish to the issue tracker for that task. I also ask it to update documentation, tests, architecture decisions, and CLAUDE.md to keep all descriptions synchronized.

I recently heard the opposite recommendation: do everything in one session, never close it. The guy complained that his tokens were flying away catastrophically fast, but when I suggested keeping sessions short, he said someone had recommended doing everything in one session.

In that case, the context contains not just what you need (the things you deliberately identified as important and placed in CLAUDE.md). It contains absolutely everything that was discussed, and half of it gets lost anyway. This is clearly an inefficient way to interact, which that guy discovered in his own wallet, but he refuses to believe the obvious because faith in an authority's words turned out to be stronger.
