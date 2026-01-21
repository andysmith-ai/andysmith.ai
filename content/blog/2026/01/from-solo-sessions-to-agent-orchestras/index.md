---
title: "From Solo Sessions to Agent Orchestras"
description: "A framework for vertical and horizontal scaling of AI systems through maximizing inference utilization"
date: 2026-01-21T07:37:45
featured_image: featured.png
images: ["featured.png"]
---

The tactic is simple. Figure out how to consume all available compute, then find ways to increase that availability.

I have a Claude Code subscription and other AI tools. My goal is to use them as efficiently as possible. This means pushing token usage closer to 100% of the available limit while maintaining acceptable quality. Solving real problems, not running expensive LLMs in circles.

## Measuring Utilization

For objective assessment, I need to periodically collect usage and limits statistics. Perhaps every minute or every ten minutes. Store it in a database, build graphs, and devise methods to minimize the area under the (limits - usage) curve across all three parameters: current session, weekly totals, and Sonnet-specific allocations.

How to objectively evaluate effectiveness? I haven't fully figured this out yet. It will likely be an LLM bot that reads all my sessions, looks for anomalies, and suggests improvements.

## Scaling Options: From Simple to Complex

Here's how I see the path to full utilization:

**1. Parallel Manual Sessions**

The simplest approach. I work on 2-3 tasks in side-by-side Claude Code sessions, switching my attention between them. Low overhead, immediate results.

**2. Agent Orchestra**

Design an AI environment where multiple agents work in parallel, communicate, negotiate, and I simply observe. This requires upfront architecture work but multiplies throughput.

**3. Overnight Research Tasks**

Formulate tasks for long-running research and leave them running overnight with a defined token budget. Wake up to results. This captures hours that would otherwise be wasted.

**4. Periodic and Event-Driven Tasks**

Assign the AI recurring jobs. Collecting daily email summaries at 4 AM, responding to certain events. These tasks utilize nighttime hours when I physically cannot participate in options 1 and 2.

**5. Fully Autonomous Agent Teams**

The end goal. I set a task, agents self-organize into teams, and solve problems while planning their token expenditure based on usage statistics. They schedule research and tests for nighttime (compute-heavy, LLM-intensive, no human needed) and communication tasks for daytime.

## The Dual Scaling Problem

This breaks down into two challenges. Vertical scaling: teach agents to work autonomously for longer periods. Horizontal scaling: teach agents to collaborate effectively as teams.

I'm confident many teams are working on this. I'm happy to contribute what I can.

## The Resource Allocation Problem

One thing I haven't solved: how to distribute usage between my manual work sessions and automated agents. If agents consume all available tokens, but I need to do something myself, what then?

This looks like a case for applying management and organizational planning practices to compute resources. Budget allocation. Priority queues. Reserved capacity for human override. Essentially, accounting for AI agents.

Solving these problems would mean the scaling challenge is addressed. From there, it's infinite incremental improvement.
