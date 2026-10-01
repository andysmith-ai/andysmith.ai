---
title: "Communication Between Runners and Agents"
type: post
description: "A shared message bus connects mechanical runners, AI agents, and people, allowing automated loops to publish results while agents and humans monitor, adjust, intervene, and audit."
date: 2026-10-02T00:18:07+07:00
announcements:
  telegram: "I am thinking about a tool that connects mechanical processes, agents, and people."
  bluesky: "I am thinking about a tool that connects mechanical processes, agents, and people."
---

I am thinking about a tool that connects mechanical processes, agents, and people.

Every agent run through Hermes or another harness costs money. But besides intellectual tasks, we also have mechanical work: CI checks, monitoring, and continuous model training in a loop. There is a process defined by code that runs with specific parameters and produces intermediate messages and a result.

The idea is to separate tasks performed by intelligence from tasks performed by mechanics, then connect them.

The simplest loop looks like this: a mechanical runner does the work and sends the result to an agent. The agent provides feedback that affects the next run.

![image0.png](https://files.andysmith.ai/img/d3445ca223d68f37bdcf326afbebe0043d81ceb0f61b46553d06e2bb28ec3e8c/image0.png)  

But a person is often needed here. They need to see both the result and the feedback. They can say, "Yes, I like everything." Or, "Wait, you queued the next task differently from how I want it. Let's fix it."

My solution is a shared message bus. In our case, it is Buzz, but it could be Telegram, Zulip, or another communication platform that people can use.

![image1.png](https://files.andysmith.ai/img/30de43465f10d4e37ffce3bdf687d4b5c9d70a44fe2c9b484e2deb56faaee731/image1.png)  

Agents and several runners also work on the same platform. There can also be several people and agents.

The runner reads the config and creates a separate thread for each run. It posts the run parameters there, then intermediate messages, and finally the result. All of this happens mechanically.

The agent sees the messages in the thread and responds to them. It can simply reply, "Got it, everything is okay." If something is wrong, it can change the config, stop the current run, and restart it with different parameters.

A person watches this in the same thread and can step in at any time. For example, they can write, "No, that's enough. Stop it." The person's messages also reach the agent, which can decide what to do next.

The runner's loop itself follows the code: read the config, start the run, publish the result. If everything is okay, it keeps the cycle going. It creates a new thread for the next run.

![image2.png](https://files.andysmith.ai/img/73ae9c7e252dbdd702659fc92288b7467d78d8ed52fbabec5bba7b326284a548/image2.png)  

The mechanics run, the agent sees their messages through the message bus, and people can observe, adjust, and audit the entire process. We use Buzz as the message bus. A play on words.

This is roughly how we use it, and we really like it.
