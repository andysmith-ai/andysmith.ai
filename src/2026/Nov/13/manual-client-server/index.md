---
title: "Manual Client-Server"
type: post
description: "The post considers disposable local-storage-backed web pages for complex agent interactions, while arguing that text usually suffices and avoids the security risks of a permanent server."
date: 2026-11-13T12:17:21+07:00
announcements:
  bluesky: "When communicating with agents through a text interface, complex interfaces become a problem."
---

When communicating with agents through a text interface, complex interfaces become a problem.

Sometimes I need to go through a checklist, answer questions, or fill out a form.

Personally, I prefer to do everything in text. I even try not to use Claude's widgets, where it asks questions and offers answer choices directly in the terminal. But I accept that some tasks require this approach.

In that case, I assume the agent could create a disposable page, upload it somewhere in S3 with a public address, and give me a link to it. Or it could simply send me the page as a file.

The page could have an interface of any complexity. I do everything I need, with intermediate results saved in local storage. At the end, the page gives me a text representation of the result that I can copy and send to the agent.

This approach has some drawbacks, of course, but it seems much safer because I would not have a server running forever that could be hacked. Everything on the internet will be hacked sooner or later. This becomes obvious if you look at the graphs of hacks.

At the same time, I have almost never encountered such a need. The only exception was when I needed to choose a font and compare different text styles side by side. Years of working in the terminal and Emacs have taught me that everything is text, and anything that is not text can be reduced to text.
