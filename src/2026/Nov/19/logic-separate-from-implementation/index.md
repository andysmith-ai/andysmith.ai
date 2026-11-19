---
title: "Logic Separate From Implementation"
type: post
description: "A reflection on defining an agent by its external contract rather than its runtime, proposing that any implementation can join the network if it fulfills an agreed, evolving interface."
date: 2026-11-19T14:23:54+07:00
announcements:
  bluesky: "Building my platform for running agents came down to solving infrastructure questions, such as exactly how to run agents, before solving architectural problems, such as what exactly counts as an agent, meaning the external contract exposed by an agent as a black box."
---

Building my platform for running agents came down to solving infrastructure questions, such as exactly how to run agents, before solving architectural problems, such as what exactly counts as an agent, meaning the external contract exposed by an agent as a black box.

At this point, it is useful to stop and understand what an agent actually is and what contract it has with the outside world.

How to implement and run an agent so that it fulfills this contract is a secondary question. I can run my agents on a platform with mutual preemption, Agent Substrate/kagent, on a home server in smolvm, without virtual machines, or even on a toaster running NetBSD. If it implements an agreed contract, it is a full participant in the agent network.

The question is, what is this contract? What is an agent, and what properties must an object have to be considered an agent?

Clearly, the answer to this question is not a permanent truth. It is a hypothesis that will be updated over time, but for now I need to formulate at least a first version.
