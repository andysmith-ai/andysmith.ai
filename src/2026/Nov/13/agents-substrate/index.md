---
title: "Agents Substrate"
type: post
description: "Exploring Agents Substrate on k3s, a Kubernetes layer that rapidly suspends and resumes agents with their context preserved, enabling large-scale agent workloads on modest hardware and forming part of Backfabric’s core."
date: 2026-11-13T12:40:14+07:00
announcements:
  bluesky: "I am exploring Agents Substrate: https://ate.dev."
---

I am exploring Agents Substrate: https://ate.dev.

In short, it is a layer on top of Kubernetes. It was originally built for GKE, but I am deploying it in k3s on my own servers. It lets me run agents as interruptible processes instead of long-running daemons.

An agent does not run all the time. Most of the time, it "sleeps" while waiting for incoming tasks or a response from tools, an LLM, or other agents.

Substrate can run several workers, each of which can run one agent. All other agents sleep during that time, or wait in a queue to be woken up.

Waking and suspending an agent is fast, up to 500 ms. Its entire context, including disk and memory, is preserved.

It is similar to an operating system's pseudoparallelism. One process can be preempted by another, then later resume from the exact point where it was suspended.

In general, this makes it possible to run thousands of agents, or millions according to the authors, on relatively modest hardware.

This idea is going into the core of Backfabric.
