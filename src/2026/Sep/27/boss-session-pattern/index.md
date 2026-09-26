---
title: "Boss session pattern"
type: post
description: "The Boss session pattern has a top-tier model direct autonomous, task-specific workers in natural language and review their brief results, avoiding hands-on work and micromanagement while reducing expensive token use."
date: 2026-09-27T00:49:08+07:00
announcements:
  telegram: "Watching how my agents work, I have arrived at a concept I call the Boss session. This session does no hands-on work. It only watches all the other workers and gives them instructions in natural language."
  bluesky: "Watching how my agents work, I have arrived at a concept I call the Boss session. This session does no hands-on work. It only watches all the other workers and gives them instructions in natural language."
---

Watching how my agents work, I have arrived at a concept I call the Boss session. This session does no hands-on work. It only watches all the other workers and gives them instructions in natural language.

This may look like using subagents, but it is actually the opposite approach.

Unlike subagents, workers are autonomous units. They have their own context, access, and sessions.

Workers listen to the Boss and interpret its commands based on their own context. They do what their role requires and publish a brief result of their work, reporting it to the Boss. This removes all micromanagement from the Boss and lets it focus on the work. It implements the concept I described here:
https://andysmith.ai/2026/Sep/25/separating-core-work-from-technical-work/.

The Boss session uses the most expensive and best model available, so every token is very expensive. The workhorse models are chosen for the task, and their sessions are short-lived.

Ideally, this approach will maximize token savings. This is very relevant now. Even though Opus 5.5 is quite efficient, I think the limits will be cut very soon, and it will be very painful, as it was in early September.
