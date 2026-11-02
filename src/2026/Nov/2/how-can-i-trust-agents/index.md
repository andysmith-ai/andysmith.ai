---
title: "How Can I Trust Agents?"
type: post
description: "The post explores trusting autonomous agents through clear contracts, secure infrastructure, delegated capabilities, failure reporting, and organization as code rather than constant oversight."
date: 2026-11-02T14:22:39+07:00
announcements:
  bluesky: "I now have two agents running on my new infrastructure: Hermes, which I use as a personal assistant, and a publisher for blog notes."
---

I now have two agents running on my new infrastructure: Hermes, which I use as a personal assistant, and a publisher for blog notes.

Hermes can work with email out of the box, but the default connector cannot encrypt messages or verify signatures. It is designed more for help desk scenarios. I decided not to patch it. Instead, I made an architectural decision: the agent implements A2A, while my layer handles everything else, including identification, authorization, and security. It does not have to use email. It can use any communication protocol.

If I want to publish something on my blog, I simply email my publisher agent. The idea is that I do not know what is under the hood or exactly how it works. The contract is all that matters. I give it text, and it publishes that text on the site. It does not check facts, logic, or links. It simply publishes. This is my decision. The publisher publishes a dump of what is in my head, with all its distortions, rather than a polished and cleaned-up version. If I want to add checks, I will create a new agent that calls the publisher at the end of its workflow, if all checks pass. This is how I expand a network of capabilities, and I expect a synergistic effect from many agents working together.

After I send a task, I forget about it. I expect it to be completed and a completion report to arrive in my inbox at some point. If the task cannot be completed for some reason, such as an expired publishing token or another technical issue, I expect a response from the agent or from my layer saying that something is wrong. When I receive a response saying, "Something is broken," I will try to remember what the task was. Until then, I do not need to keep it in my head.

The Zeigarnik effect in its pure form.

Of course, mistakes can happen, and it is tempting to control every step. Just as any new manager who is unsure of their team wants to interfere at every step, I want to watch everything that happens here. But this is more of an antipattern. It will not make the agents work better. I also cannot expect to catch an error by chance while hundreds of agents are working extremely fast. The only thing that helps here is the right organizational design, which minimizes the impact of mistakes and makes it possible to detect them early. This is also where interesting concepts like Organization as Code come fully into view. They make it possible to apply an engineering approach to building organizations and even let agents build verifiable teams of agents. It would be interesting to apply formal methods here, with an organization as a mathematical object that can be formally verified and optimized, and whose effectiveness can be proven. That sounds cool.
