---
title: "One Agent or a Team of Agents"
type: post
description: "The author argues that specialized agents with limited roles and permissions are safer than one all-purpose agent, and explains their goal of making agent teams easy to deploy transparently on private infrastructure."
date: 2026-10-29T12:56:59+07:00
announcements:
  bluesky: "When people learn that I am building a network of agents and betting that everyone will have many agents, the first thing I hear is, \"I have one agent, and that is enough for me.\""
---

When people learn that I am building a network of agents and betting that everyone will have many agents, the first thing I hear is, "I have one agent, and that is enough for me."

I usually reply, "Good for you, but one is not enough for me." Sometimes, though, I feel like debating it.

First, we need to define what an agent is. There are two opposing views.

1. An agent is an agent session that performs a specific task. All agents start from the same shared base. There is a starter setup for every task, with all potentially necessary skills, tools, and the broadest possible access.
2. An agent is a launcher for a specific type of task. For example, an agent that reviews pull requests in a particular repo, or in every repo in an organization. It can review different PRs independently, but these tasks still belong to one agent. In this case, each agent has limited permissions assigned only to it. These are the minimum permissions needed to do a specific job.

The first option is the simplest. You just launch Codex or Claude Code and work in it. If you need something, you add it. Security relies on *faith* that the model is smart and will figure things out. Joking aside, I have met people who actually think this way.

But this is roughly the same as giving a pizza delivery driver the key to a server. In a normal situation, there is nothing wrong with that because the driver has no reason to break anything. But that does not mean they will never have such a reason in the future.

To me, dividing work, responsibility, and access within my team of agents is an essential architectural requirement that is not up for debate. Otherwise, it would be like putting graduates of top universities in a room and demanding that they do something. They might reach an agreement among themselves, but not necessarily in my interests. Of course, agents can be used to implement an organizational structure, but abandoning it completely is madness in my view. Sooner or later, everyone will come to this. That is why I am preparing for it now. My goal is to make launching a team of agents on your own infrastructure as fast and convenient as possible.

If you need to organize processes with agents and think you are overpaying, let’s discuss it. I am sure we can cut costs and make the process more transparent.
