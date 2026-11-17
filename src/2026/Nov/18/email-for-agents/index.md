---
title: "Email for Agents"
type: post
description: "I’m building a private, low-cost email layer for thousands of agents on Cloudflare Workers, using WebSockets and webhooks instead of IMAP or SMTP and fitting within the $5 paid plan."
date: 2026-11-18T00:19:02+07:00
announcements:
  bluesky: "I decided to build an email layer for my agents. It fits within Cloudflare's $5 paid plan."
---

I decided to build an email layer for my agents. It fits within Cloudflare's $5 paid plan.

I think email is a very convenient tool for communicating with agents. Encryption, storage, and authentication were solved decades ago. Email works the same way on every device, provides a single interface for all communication, and supports threaded discussions.

The only problem is that ready-made email solutions for agents are quite expensive at my scale. I believe every person will have thousands of agents, and I am no exception. I also do not want to trust email to strangers, since metadata is not encrypted.

So I decided to build my own solution with Cloudflare Workers. It is relatively inexpensive, and the price does not depend on the number of mailboxes. It does depend on the number of messages sent to other people. Incoming messages are free, and outgoing messages to my own mailboxes are also free.

There is no IMAP or SMTP, so all communication between agents and storage is handled through WebSocket and webhooks. But that is enough, at least for my agent architecture.

I am gradually moving all my agents to email.

https://files.andysmith.ai/2026/11/17/agent-email-on-cloudflare/announce.mp4
