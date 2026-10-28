---
title: "Permissions for Agents Through Decentralized JWTs"
type: post
description: "This post compares permanent and task-level agent permissions and proposes decentralized authorization using per-agent certificates and CA-signed JWTs, with request verification and a shared revocation list."
date: 2026-10-28T17:27:55+07:00
announcements:
  bluesky: "In a network of agents, we need a way to manage agent permissions. Specifically, we need to define which tools an agent can invoke."
---

In a network of agents, we need a way to manage agent permissions. Specifically, we need to define which tools an agent can invoke.

There are two cases:

1. An agent uses a tool.
2. An agent calls another agent.

I see two architecturally different ways to handle this:

1. An agent has permanent permissions. For example, if an agent can access GitHub, this is defined in its configuration when it is created.
2. Permissions are defined at the task level. The task initiator, a human, sets specific constraints when defining the task. Any agent can then do anything within those constraints.

The second option looks more flexible but less convenient. At the start of a task, it may not be clear which permissions are needed to complete it.

I am not considering an option where each agent or tool has a fixed list of agents that can call it. In that case, deploying a new agent would require redeploying all the other agents.

Each agent should have a "pass" that provides agent authentication. It confirms that the request is being made by the owner of that pass. I think the S/MIMIE approach to signing and encrypting email could work here. Each agent receives its own certificate, signed by a certificate authority that all other participants trust. Every request signed with this certificate is a request from that agent. As long as the certificate has not been stolen, it can be treated as authenticating the agent.

In addition to the "pass," the agent needs a set of permissions. The main question is where they should be stored, and in what format.

My hypothesis is to package a set of permissions and the certificate ID into a JWT, then sign the JWT with a central CA key that everyone trusts. An agent team may have several such signers. They are the team owners.

When agent A needs to call agent B, it includes a JWT that says: "This JWT was issued to agent A. It has the myvipteam.website.publication permission." The called agent verifies the CA signature on the JWT, verifies agent A's signature on the request, checks that A's certificate has not been revoked, and checks that the JWT has the required permissions. If all checks pass, it performs the task.

This approach seems slightly more complex because creating an agent requires generating a certificate and assigning permissions. However, it is decentralized and requires almost no shared infrastructure, except for a revocation list.
