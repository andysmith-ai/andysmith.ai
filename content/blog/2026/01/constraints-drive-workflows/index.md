---
title: "No Way Back: Why Constraints Drive Better Workflows"
description: "How switching to pure Claude Code forced me to abandon old habits and embrace a new paradigm of working with AI agents."
date: 2026-01-15T17:14:22
featured_image: featured.png
images: ["featured.png"]
---

I never run code locally. It's not safe. Instead, I always use sandboxes. Once upon a time it was a remote machine with Emacs that I connected to via SSH. Then I moved to GitHub Codespaces with VS Code. Then it became a remote machine again, this time with [VS Code tunnels](https://code.visualstudio.com/docs/remote/tunnels).

In the Claude Code era, I kept these habits. I would connect to the machine through a VS Code tunnel (wait for it to load), open a terminal (wait for it to load), run Claude Code (and with Codespaces I had to authenticate every single time). Then I'd finally get to work.

This approach worked well enough for me.

But yesterday I decided to switch to a [new workflow](/blog/2026/01/done-today-beats-perfect-never/) where I run pure Claude Code. I'm embarrassed to admit that in several months of Claude Code's existence, I had never done this outside of VS Code.

And I liked it.

More importantly, I realized that old habits were holding me back. Knowing I could always open a file and edit it manually, knowing I could always switch to another terminal tab and do something myself. This didn't motivate me to do things differently. It pushed me to stay in the old paradigm.

Working in pure Claude Code forces you to do things differently. I can't open a file and edit it by hand (well, technically I can, but I'd have to remember the hotkey, so effectively I can't). I can't just go and run something in the console.

Instead, I need to make Claude Code do it. And do it efficiently, without burning through a week's worth of tokens in a couple of days. There's no way back. Doing it the old way is no longer an option.

I'm glad I figured this out, even if a bit late. Maybe later I'll return to Vim or Emacs, but I'll be calling them from Claude Code, not the other way around. Now it seems clear that Claude Code is the primary tool. I start it in the morning and don't exit until evening.

Next horizons: orchestras of agents, inter-agent communication, organizations of agents with shared memory and processes. Fun times ahead.
