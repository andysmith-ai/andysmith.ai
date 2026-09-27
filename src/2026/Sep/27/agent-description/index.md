---
title: "Agent Description"
type: post
description: "An agent description is more than image build config: it guides automated builds, operator-led onboarding, and orchestration, becoming the source of truth for creating and running the whole system."
date: 2026-09-27T21:52:23+07:00
announcements:
  telegram: "At first, I thought of an agent description mainly as build instructions. There is a description. We use it to build the agent image. The image includes the environment, tools, and everything else the agent needs to work."
  bluesky: "At first, I thought of an agent description mainly as build instructions. There is a description. We use it to build the agent image. The image includes the environment, tools, and everything else the agent needs to work."
---

At first, I thought of an agent description mainly as build instructions. There is a description. We use it to build the agent image. The image includes the environment, tools, and everything else the agent needs to work.

But now it looks like the description is needed for much more than the build.

In fact, we have at least three operations:

**build**

We build the agent image from the description fully automatically.

**onboard**

We need to create all the external entities through which the agent will exist in the system.

For example, if the communication layer is Telegram, we need to create a bot with the right name. If it is Zulip or some internal tool, it will have its own equivalent.

This is where issues can arise that cannot be properly handled during the build. For example, the name may already be taken. Or we may need to create a secret and put it in secret storage.

So onboarding looks more like an operator task.

**run**

The same description is needed here again.

An image alone is not enough to run the agent.

We need to know what the agent is allowed to do, what policies it has, which secrets to connect, what resources it needs, and what state the infrastructure should be in after launch.

So the description ends up serving as instructions for several systems at once.

For the builder.

For onboarding.

For the orchestrator.

This changes how I think about the agent description language.

It is no longer a config for a Docker image.

It is the source of truth from which a working system is created.
