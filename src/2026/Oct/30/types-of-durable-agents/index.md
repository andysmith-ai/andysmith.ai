---
title: "Types of Durable Agents"
type: post
description: "A practical classification of durable agents by task lifecycle argues for prioritizing request-response infrastructure, while treating timers as events and loops as finite-state machines or, when needed, long-running containers."
date: 2026-10-30T23:42:25+07:00
announcements:
  bluesky: "To organize infrastructure for Durable Agents, it is useful to classify them by the lifecycle of the tasks they support."
---

To organize infrastructure for Durable Agents, it is useful to classify them by the lifecycle of the tasks they support.

1. Request-response. The agent sleeps most of the time. When it receives a request, it wakes up, performs the task, and goes back to sleep.
2. Timer. A task runs at a specific time.
3. Loop. The agent runs in a loop without sleeping. It may sleep while waiting for a response from other agents.

The first option is the easiest to support with infrastructure. We simply save the state of the working directory after the task is complete and restore it before the next run.

The second option can be seen as a special case of the first. The timer is simply a component outside the agent that sends it "do X" events.

A loop is the most difficult object to make Durable because it requires an environment that is always running. However, a loop can be modeled as a finite-state machine. Each step of the loop is then just a specific agent performing a specific task and passing control to the next one. While one agent is working, all the others are sleeping. I am not entirely sure this approach works well for every class of task. I think some tasks are better served by a traditional long-running container.

But the foundation here is the agent that wakes up when called, performs a task, and goes back to sleep. Infrastructure solutions should focus on these agents, which seem to be the majority of mine. Specifically, they need fast onboarding and access restrictions.
