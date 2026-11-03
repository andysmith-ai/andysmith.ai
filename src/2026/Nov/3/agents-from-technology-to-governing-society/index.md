---
title: "Agents, From Technology to Governing Society"
type: post
description: "A practical look at agent infrastructure argues that the real challenge is not Kubernetes but governing vast, unmotivated agent populations through organizational structures, politics, sociology, and human-made rules."
date: 2026-11-03T18:17:32+07:00
announcements:
  bluesky: "I have spent a long time designing the architecture of an infrastructure environment for agents. Here is why it is not as simple as it seems."
---

I have spent a long time designing the architecture of an infrastructure environment for agents. Here is why it is not as simple as it seems.

As with almost any architecture problem, there are three types of solutions:

1. Buy a ready-made solution. I have not yet seen any ready-made solutions from major vendors. When they appear, and the early forms of these ideas already exist in Grok Bot, OpenAI Dot, and similar products, the data will be locked in with the vendor, it will be impossible to control model quality, and the price will keep rising, because where else would you go?
2. Build everything yourself from scratch. Some people take this path, but it requires more than just building and endlessly maintaining what you want. You also have to avoid turning the solution into a monolithic monster where you cannot change anything without the whole thing falling apart. I have personally gone through this many times in my life, and it is not for me.
3. Assemble the solution you need from ready-made building blocks. You need to study the primitives already available on the market for solving small tasks, then combine them like building blocks into the solution you need. In my view, this is the most practical approach.

But the main problem is not so much technical as managerial.

The key problem is that agents write A LOT.

When you have one agent that writes on request, reading its answers is pleasant and interesting.

When you have two or three agents working around the clock, reading their answers becomes very difficult, almost impossible.

When you have more than 100 agents, the very idea that someone could read their output, let alone step in and oversee them, seems absurd.

This brings us to the need to build a model for interaction between agents. In other words, we need to create an organizational structure for them.

That is the main challenge, not configuring Kubernetes.

At the same time, agent companies do not develop according to the same rules as regular companies or giant corporations. In a company, you can fire a person, and that person tries to avoid being fired. You can also give them a bonus or promote them, and they try to improve their quality of life. But an agent has no motivation to do better. There is nothing you can do about this, at least at the level of using LLM agents rather than training them.

So managing agents requires an understanding not only of technology, which is completely obvious, and management, which is slightly less obvious, but also of politics and sociology, which seems far less obvious, as applied to agents.

In other words, we are not so much building companies out of agents as states made up of agents. We humans need to create the rules by which these states will live and develop. Of course, we can choose some model of self-government among the agents and see what happens.

This is somewhat more difficult than installing minikube and deploying Hermes there, don't you think?
