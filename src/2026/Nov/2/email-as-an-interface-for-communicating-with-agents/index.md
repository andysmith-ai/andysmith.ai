---
title: "Email as an Interface for Communicating With Agents"
type: post
description: "The author explores email as a unified, secure, asynchronous interface for communicating with agents, reducing context switching and keeping every session organized in one inbox."
date: 2026-11-02T13:31:01+07:00
announcements:
  bluesky: "At some point, I noticed that almost all my work happens in sessions with agents. These agents and sessions vary widely. Some agents live in Telegram, some in Zulip, some in Buzz, and there are also many omp sessions in terminals like cmux."
---

At some point, I noticed that almost all my work happens in sessions with agents. These agents and sessions vary widely. Some agents live in Telegram, some in Zulip, some in Buzz, and there are also many omp sessions in terminals like cmux.

The problem with this workflow is that when you have many contexts, switching between them becomes very costly. You have to remember that you have an unanswered session in Zulip while you are messaging an agent in omp. You also need to check Slack because, while you were focused on another session, you might have missed a notification.

I decided to put things in order and build a single tool for communicating with all my agents. I wanted one system that I would open in the morning and close in the evening. My entire work and personal life, hobbies, and self-development would happen in this system, with the contexts strictly separated, of course.

I spent several days doing deep research and developing such a tool. The result was predictable:




I realized that I was inventing a new communication layer, including user identification, history storage, and encryption. I abandoned the idea and decided to try something that already existed.

I needed something convenient, intuitive, secure, asynchronous, available on many devices, and preferably free and open source.

This led me to the idea of using email to communicate with agents.

Email meets almost all my requirements, including federation, independence from any specific hosting provider, encryption, and identification through digital signatures. It also lets me bring every context together in one place. It is incredibly convenient. When everything, literally everything, is an email, there are only two kinds of activity: 1. Read or write an email. 2. Turn a task into communication by email.

After trying this flow, I realized what I had been missing in traditional agent interfaces: asynchronicity. When you work in a chat, an instant response is not exactly required, but it is implied. The agent starts responding immediately and holds your attention. This caused some problems with concentration, though I accept that this may be specific to me.

Email is the ideal tool for asynchronous work. You focus on one task at a time, but only until you send the result. Once the email is sent, you can forget about it and either wait or move on to the next task. There is no fear that the session will get lost among hundreds of other sessions or disappear entirely because the SSH connection dropped. The reply will arrive in a single inbox, and you definitely will not miss it.

![standards 2x](https://files.andysmith.ai/img/39f575f7d379b7b914c75f5069d31ff596133f2e2854a7bd14c4276ac07e7560/standards-2x.png)
