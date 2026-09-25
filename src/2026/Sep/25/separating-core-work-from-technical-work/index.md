---
title: "Separating Core Work from Technical Work"
type: post
description: "The post argues that managing issues, pull requests, and commits distracts AI agents from useful work, and proposes an external oml.sh layer to prepare and monitor the environment while handling those tasks separately."
date: 2026-09-25T17:16:03+07:00
announcements:
  telegram: "Very often, instead of doing useful work, my agents get distracted by technical tasks: creating issues, pull requests, and commits. This fills up the context and reduces the efficiency, and therefore the quality, of their work."
  bluesky: "Very often, instead of doing useful work, my agents get distracted by technical tasks: creating issues, pull requests, and commits. This fills up the context and reduces the efficiency, and therefore the quality, of their work."
---

Very often, instead of doing useful work, my agents get distracted by technical tasks: creating issues, pull requests, and commits. This fills up the context and reduces the efficiency, and therefore the quality, of their work.

I have tried different approaches. For example, I moved technical tasks into a separate tool that the agent can call. All the complexity stays inside the tool, and the agent only gets the result. But this does not solve the problem because the agent still needs to "think" about calling the tool, which takes attention away from the main flow of work.

It seems that the only option is to move technical tasks one level above the agent. In other words, an external layer, which I think will be oml.sh, runs outside the agent, prepares the environment for it, monitors it through ACP, and handles technical tasks in a separate session.

This lets the agent focus on its core work, while the environment handles the setup and related tasks.
