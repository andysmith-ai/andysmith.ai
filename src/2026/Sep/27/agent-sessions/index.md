---
title: "Agent Sessions"
type: post
description: "The post argues that agent sessions should be infrastructure-level objects, with each running in an isolated, on-demand pod or sandbox to simplify the harness, prevent shared failures, and avoid idle resource costs."
date: 2026-09-27T21:50:35+07:00
announcements:
  telegram: "I am thinking about the agent session as an object and the level at which it should exist."
  bluesky: "I am thinking about the agent session as an object and the level at which it should exist."
---

I am thinking about the agent session as an object and the level at which it should exist.

There are two options.

First, a session is a harness-level object. There is one permanently running agent instance, and parallel sessions are created inside it.

Second, a session is an infrastructure-level object. Each session gets a separate pod or sandbox and effectively becomes a separate agent instance.

The first option is easier to implement, but the more I think about it, the more I prefer the second one.

If sessions live inside the harness, the harness suddenly has to do a lot. It has to create sessions, manage them, restore them, and handle concurrency.

This also creates an unpleasant coupling. If the agent pod goes down, all the sessions running inside it may go down with it.

If each session is a separate infrastructure object, everything becomes much simpler.

A session is a fully isolated environment. It has its own environment, repositories, variables, and possibly secrets.

If one session fails, the others do not notice at all.

Most agents do nothing most of the time. If an agent instance is created only while it is working, we do not need to keep resources allocated for every role all the time.

We may have a thousand or 50 thousand defined roles. That does not mean we need to keep 50 thousand pods running.

Resources appear only when an agent is actually working.

Of course, orchestration then has to move somewhere else. We need a separate layer that can create these agent instances and manage their lifecycle.

I do not yet fully understand what it should look like.

But the principle itself now seems quite clear to me:

an agent session is an infrastructure object, not an internal harness abstraction.
