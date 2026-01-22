---
title: "Capsules: Isolated Environments for AI Agents"
description: "My evolution of working with AI tools and a new concept for safely running agents in isolated, reproducible environments."
date: 2026-01-22T10:36:04
featured_image: featured.png
images: ["image.png"]
twitter_discussion: "https://x.com/andysmith_ai/status/2014290165573755311"
---

My Evolution of Working with AI Tools. The Capsule Concept.

I use LLMs and coding agents extensively in my work. This post contains a brief history of my observations and hypotheses.

The first decision I made: never run agents locally. This is a rule for me. There are two reasons for this. First, I'm afraid the agent might accidentally do something unacceptable on my behalf and with my permissions. For example, delete my home directory or a client company's database (protection against such actions may either be absent or fail). Second, the agent could steal secrets from my device (keys, wallets, passwords), especially if some third-party MCP or skill is used that might contain a prompt injection instructing it to send the entire contents of ~/.ssh to an attacker's remote server.

Acting according to this decision, I started running all development on a remote machine. But I immediately encountered the next problem. For different types of tasks I need different settings, different sets of MCPs, skills, different environments. I want something like "profiles" (https://github.com/anthropics/claude-code/issues/7075), but more capable. I want a profile to include not just the Claude Code state but the entire environment: all necessary MCPs, all keys, tokens, passwords required for the agent to work, repositories.

This leads us to a new concept that I call Capsule. I'll provide a more complete architectural description and decisions about the capsule's internal structure later, but for now let's consider external interaction with a Capsule as a black box.

From a conceptual standpoint, the following aspects should be considered:

1. Capsule Template. A textual description (config) listing what should be inside. Having a text format here is critical, as it will allow using git and LLMs to create and manage capsules.
2. Capsule Instance. Creating a Capsule from a template. Multiple Capsules can be launched from a single template.
3. Command Interface. Giving commands for execution. The agent inside the Capsule needs some way to receive instructions from outside about what to do (not mandatory, some agents can go out into the world and request instructions themselves), as well as provide statistics about its work. This will allow people to interact with the agent in a capsule and agents to interact with each other.
4. Other Interfaces. MCPs can access anything, but strictly according to the rules described in the template.

Since we're talking about wanting to describe the entire environment, Nix/NixOS fits this concept very well. Most likely the template will be a Nix Flake, the instance will be a virtual machine deployed by Nix, the command interface will be determined by the agent, and other interfaces by MCP servers and other tooling in the environment. But these are still open questions.

The next question is agent selection. Currently I use Claude Code (and only it). But I need a command interface as an API and preferably a web interface, so I don't have to SSH into the virtual machine. In this case I'll probably look towards opencode, since it supports API out of the box, and in my view the quality of work for all open-source agents will tend towards the same value (since the code is open, successful solutions will spread to all tools, and unsuccessful ones will die out). Therefore there won't be a big difference between choosing opencode or Claude Code.

The immediate plan is to develop 1-2 capsule templates for different tasks and start using them. After that, I can think about how to run multiple agents in parallel.

{{< x >}}
