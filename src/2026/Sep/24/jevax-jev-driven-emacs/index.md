---
title: "Jevax: Jev-driven EMACS"
type: post
description: "A plan to run Jev inside EMACS to predict the next command from the screen state and task, while exploring hierarchical command selection to handle EMACS’s vast command set."
date: 2026-09-24T01:40:43+07:00
announcements:
  telegram: "I plan to try running Jev inside EMACS so that it predicts the next command to execute."
  bluesky: "I plan to try running Jev inside EMACS so that it predicts the next command to execute."
---

I plan to try running Jev inside EMACS so that it predicts the next command to execute.

The input is the screen state + task, along with the possible next commands. The expected output is the probability of the next command.

Since every action in EMACS is a command, Jev can do anything this way, absolutely anything.

The only problem is that there are an incredible number of commands, and it is unclear how Jev will handle this.

This might be optimized somehow. For example, the commands could be organized into a tree, first selecting a group of commands and then the right command within that group.
