---
title: "Static and Dynamic Reconciliation of an Agent Team from a Description"
type: post
description: "The post weighs static Kubernetes manifest generation against a custom controller for launching agent teams, favoring an inspectable static approach until continuous reconciliation is clearly needed."
date: 2026-09-27T21:56:11+07:00
announcements:
  telegram: "Another question I have is how exactly to launch agents. In other words, how to turn a description into a set of running agents, either in a k3s cluster or in microsandbox."
  bluesky: "Another question I have is how exactly to launch agents. In other words, how to turn a description into a set of running agents, either in a k3s cluster or in microsandbox."
---

Another question I have is how exactly to launch agents. In other words, how to turn a description into a set of running agents, either in a k3s cluster or in microsandbox.

Suppose we already have a description of the agent team.

Now we need to bring the cluster into the state that matches this description.

I see two approaches here.

The first is static.

We run `run`. It takes the description and generates a regular set of Kubernetes manifests.

We can inspect the result, verify it, put it in a repo, and then let a GitOps controller apply this state to the cluster.

The second option is much cleaner architecturally.

We could build our own Kubernetes controller that reads the description directly and continuously reconciles the actual state of the cluster with the desired state.

But right now, I do not think we need to start with the second option.

The static option is much easier to understand.

Run `run`.

Get a concrete result.

See which pods and other objects should appear.

Check exactly what the system is going to do.

After that, if it becomes clear that we really need a continuous reconciliation loop, we can move the same model into a controller.

So my next step is not to "write an orchestrator."

The next step is much simpler.

First, I need to describe the target state of the system after `run`.

What exactly do we want to see in the cluster?

Then we can decide which mechanism is best for bringing the cluster into that state.

First, the desired state.

Then, reconciliation.
