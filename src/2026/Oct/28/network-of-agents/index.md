---
title: "Network of Agents"
type: post
description: "A vision for a decentralized or federated network of thousands of autonomous agents per person, using email and A2A interfaces, established protocols, and decentralized authentication, with authorization and observability still unresolved."
date: 2026-10-28T16:55:02+07:00
announcements:
  bluesky: "Instead of using a small number of agents, I am building an infinite network of agents that operate autonomously and interact with each other on their own. I expect each person to have several thousand such agents. Some agents will be personal. Others will belong to a company, community, or state."
---

Instead of using a small number of agents, I am building an infinite network of agents that operate autonomously and interact with each other on their own. I expect each person to have several thousand such agents. Some agents will be personal. Others will belong to a company, community, or state.

Each task that can be solved independently of the others can be implemented as a separate agent. Other agents, and people, can then ask it to perform that task.

This network must be decentralized, or at least federated. There must be no single point of failure that stores all the data from all agents. It would be vulnerable and would be taken down first.

Adding a new agent must not affect existing ones. This immediately rules out any solution where each agent knows who can contact it. Otherwise, adding a new agent would require redeploying every agent it can access.

Agents must use existing, time-tested protocols.

I expect each agent to be available through two interfaces:

1. email, for communication with people
2. A2A

These two protocols seem to overlap in part. We may need to find a way to combine them.

Authentication and authorization must also be decentralized. For email interactions, we could include a set of permissions available to the device in its signing certificate. However, this seems quite difficult when permissions need to be updated, since that would require reissuing certificates.

This question remains open for now.

We may also need to add chats using Matrix so agents can report their status promptly. However, an observability tool may be able to handle this. It could send logs to Matrix, so each agent would not need to support Matrix.
