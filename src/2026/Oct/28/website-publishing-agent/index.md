---
title: "Website Publishing Agent"
type: post
description: "A plan for a simple website publishing agent that accepts signed email, verifies the author, traces each step, provides feedback, and reveals the limits of fixed contact lists."
date: 2026-10-28T17:01:51+07:00
announcements:
  bluesky: "The first agent I am launching under the new setup is a website post publisher."
---

The first agent I am launching under the new setup is a website post publisher.

It is worth using this agent to explore the agent interface while trying to make it universal, at least to some degree.

Since only I, a human, can write on the website, this agent must have an email interface.

There are two options: use email directly, or use A2A with an email bridge.

I want to make it as universal as possible, but I am leaning toward keeping it as simple as possible so I can identify the setup's bottlenecks.

This means it should be an agent that can do the following:

1. Have a public email address and receive emails at that address.
2. Know the CA fingerprint and verify the authenticity of the signature.
3. Know the author's email address, which is mine, and start the publishing process if the signature is successfully verified.
4. Save every step in a trace and provide feedback to the user.

This is the simplest but incorrect approach.

The agent's settings store a variable list of those who can contact the agent, specifically my email address. This is acceptable in this case because my email address does not change often. But if access to agent services were given to other agents, this approach would not work.

Overall, this is very similar to what I already have running, but without signature verification and observability, so launching it in this form could be relatively quick.
