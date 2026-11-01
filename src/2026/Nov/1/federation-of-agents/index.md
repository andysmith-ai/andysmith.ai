---
title: "Federation of Agents"
type: post
description: "A fully decentralized agent network gives way to a federated model where organizations manage shared infrastructure and trust while agents securely communicate across boundaries."
date: 2026-11-01T20:48:25+07:00
announcements:
  bluesky: "I originally assumed that my agent network would be fully decentralized (P2P). Each agent would have its own identity and participate in the network as an equal."
---

I originally assumed that my agent network would be fully decentralized (P2P). Each agent would have its own identity and participate in the network as an equal.

However, this is not possible. An agent needs infrastructure, including the hardware it runs on, observability, and backups. It also needs compute, either a local LLM or an account with a vendor, source code storage, and many other things that are easier to group and handle at the organization level.

This leads me to think that the agent network should be federated, like email/jabber/marix. Each agent belongs to a team or organization and has a minimal trusted authority, at least a CA. LLM inference, sandboxes, and other infrastructure are managed centrally at the organization level.

Agents can communicate with agents from another organization, but this must be explicitly allowed. Alternatively, an agent can decide for itself based on what it knows about the sender. For example, this is how email works. Anyone can send an email, but the recipient must decide whether to respond to it in any way. This is exactly what digital signatures were invented for. I think agents need a similar solution.
