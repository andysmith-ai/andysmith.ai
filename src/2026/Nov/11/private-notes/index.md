---
title: "Private Notes"
type: post
description: "I consider a local agent that saves emailed private notes, finds semantically similar entries, and replies with links, while weighing simpler options like searching sent mail or using a private post dataset."
date: 2026-11-11T17:09:34+07:00
announcements:
  bluesky: "I need an agent that processes my private notes. Right now, these notes are scattered across different places, and I have no way to find them."
---

I need an agent that processes my private notes. Right now, these notes are scattered across different places, and I have no way to find them.

The agent should:

1. Receive the note through some interface, most likely email
2. Save it
3. Search for semantically similar notes
4. Send me a reply with links to similar notes, so I can remember what I have already written about the topic

A local agent can do all of this without sending the text to providers, since it may contain something sensitive.

On the other hand, all my private notes are already stored in my email. Maybe I do not need a separate agent to index them and can simply search through my sent messages? This can be done locally.

On the other hand, private notes are essentially the same kind of dataset that I create for public posts (https://andysmith.ai/2026/Nov/11/post-dataset/). Maybe I should not invent anything new and should simply create a private dataset and work with it in the same way as the public one? The agent would then only need to add each note to this private dataset, possibly with an embedding.
