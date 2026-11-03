---
title: "A New Agent or a Function of an Existing One?"
type: post
description: "The post weighs adding functions to an all-access agent against creating narrowly scoped agents, arguing that automated onboarding and permissions make separate agents safer, clearer, and practical at scale."
date: 2026-11-03T14:05:19+07:00
announcements:
  bluesky: "When developing a network of agents, the main decision for each new function is whether to add it to an existing agent or create a separate agent."
---

When developing a network of agents, the main decision for each new function is whether to add it to an existing agent or create a separate agent.

Consider the simplest case, the God Agent. We will treat it as the default and use it as our starting point. We have one computer, whether it is a virtual machine, a dedicated server, or a primary work laptop. All repositories are cloned there, and the agent has access to everything we have, including all servers, GitHub, and email. The same pattern applies when using Hermes. One bot does everything and has access to everything.

Advantages:

1. It is easy and simple to work with. There is no need to worry about the organizational structure.

Disadvantages:

1. The agent has access to everything. Tokens can easily leak into the session, all of them, and even extra safeguards do not help. A prompt injection compromises everything.
2. Contexts get mixed. The agent focuses not on what you want, but on what has already been done. The history of past decisions pushes it in that direction.

Possible solutions:

- One agent per role
- One agent per task

In all the proposed solutions, agent onboarding, meaning the creation and launch of a new agent, must be as automated as possible. Otherwise, this will not work.

An onboarding agent, which we will call HR, creates the agent description, defines its access permissions, and sends them to me as text for approval. If I approve them, I am acting as the security team. Some simple, noncritical permissions can be granted automatically. If the agent only needs simple permissions, the agent itself can do this.

The infrastructure is designed to run hundreds or thousands of agents. This is handled through scheduling, state recovery, and interrupting agents. So there is no problem with spawning agents at scale.

That is why I lean toward launching new agents as often as possible and making their roles as narrow as possible.
