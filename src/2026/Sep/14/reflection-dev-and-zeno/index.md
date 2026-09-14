---
title: Reflection.dev and Zeno
type: post
description: Why I built an infrastructure framework for AI native companies around a self-evolving agent orchestrator written in Clojure Lisp
date: 2026-09-14T13:46:10+07:00
---

I've spent years building and running production infrastructure at big companies with NixOS. And at night I write LISP for fun. Why not combine the two?

That's how Reflection.dev came about. It's an infrastructure framework for AI native companies, built on top of Zeno, a self-evolving agent orchestrator written in Clojure Lisp.

The problem with individual AI assistants is how hard it is to fold their output back into the team's shared context. When every employee generates a huge stream of data (code, docs, and so on), the usual ways of merging it (PRs, reviews, tests) start to break down. And since a huge part of the context lives inside personal agents that never sync with each other, this becomes a big problem.

It's about as absurd as a car factory with no assembly line, where each machinist takes a blank home in the evening and brings back a finished part in the morning. Nobody knows how he made it (and what happens if he leaves the company for some reason?). Nobody can judge the quality of the process, and you can't always tell from the result whether there are hidden defects.

No large factory works this way, but in software development it's everywhere.

An organization is its own thing, a single assembly line, with its own context and its own set of agents. It's not just a bunch of people each doing some part of the work.

This idea needs tooling to back it up.

Reflection + Zeno lets you describe any company as code. The orchestrator-company can create other agents itself (either by hard-coded logic, or based on what other agents produce). Each agent runs in an isolated sandbox and gets limited access to the shared context, determined by its role. The roles themselves can be updated and extended dynamically, on the fly.

People work with the system through chats: Zullip/Discourse/Buzz. They discuss ideas, assign tasks to agents, answer agents' questions. And the agents that belong to the company do all the work.

That's how an organization can evolve, but a human sets the rules of that evolution. And LISP lets you do it as elegantly as possible, which brings the fun back into development.
