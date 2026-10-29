---
title: "Email adapter for A2A"
type: post
description: "The post proposes an email-to-A2A adapter with durable message queues and S/MIME handling, allowing asynchronous agents to remain platform-independent, universal, and easier to deploy."
date: 2026-10-29T15:36:04+07:00
announcements:
  bluesky: "I am thinking about how to connect agents through A2A and email."
---

I am thinking about how to connect agents through A2A and email.

Ideally, an agent should understand only A2A and expose its services only through it. This makes communication much simpler. It does not matter what is used to communicate with a person, whether it is email, a chat such as Buzz or Zulip, Telegram, or anything else. You only need a connector between the chosen communication tool and A2A.

One small caveat: this will work only with asynchronous agents. There will be no real-time communication here. But 100% of my agents work this way so far, so I do not really need it. Voice agents will use a different architecture.

My publishing agent currently works differently. It can work with email itself, including receiving and sending messages. It does not even use IMAP or SMTP. It runs in a Cloudflare Worker and uses worker features to handle email.

This is enough for a basic tool, but the architecture looks wrong:

1. The tool depends entirely on Cloudflare and cannot be moved elsewhere.
2. It is impossible to connect another tool that supports A2A but does not support S/MIME email. For example, hermes supports email but cannot verify signatures or encrypt messages.

So I am arriving at the following, more general setup.

1. If an agent needs to communicate by email, meaning it is an external agent rather than an internal one, it needs an email account that stores a queue of unprocessed messages. This is clearly better than keeping the queue in a worker's memory. If processing fails, the worker simply loses the message, as happened today with the previous post.
2. The agent, or something next to it, should have an email <-> A2A adapter. The adapter must verify encryption and signatures, unpack the message, pass it to the A2A agent for processing, get the result, and send the reply to the user by email, or through a chat, depending on the adapter.
3. In this case, A2A is not secured separately, but it is accessible only to the email adapter.
4. If the agent is internal and does not have A2A, the email adapter is replaced with a checker that can use the chosen method. It can verify a decentralized access pass or use a centralized authorization service.

This will make the implementation somewhat more complex, but it will make all agents universal, which in turn will reduce onboarding time for launching new agents.
