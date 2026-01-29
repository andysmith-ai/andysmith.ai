---
title: "Clawdbot, Capsules, and Self-Evolving Agents"
description: "My impressions of Clawdbot and why I think AI assistants need a minimal core with self-development capabilities instead of feature accumulation."
date: 2026-01-28T08:07:08
featured_image: featured.png
images: ["image.png"]
twitter_discussion: "https://x.com/andysmith_ai/status/2016429295799849140"
---

Yesterday all channels were buzzing about Clawdbot. I decided to install it and give it a try.

I liked the concept. Following my thinking from [Product Over Technology](/blog/2026/01/product-over-technology/), I always consider the product concept and how to sell it first. The execution is not great, but that's not what matters. What matters is that it's generating hype (meaning it sells) and it works well enough.

What I fundamentally didn't like was the lack of a platform approach. No separation of important and unimportant. No core versus everything else. This led to having to think about *everything* during installation. Network configs (Tailscale), provider settings (though you could reuse what's already in `~/.claude/`), plugin sets. I have no idea which plugins to enable right now. I haven't even decided what I need this for. I want to try it quickly and move on. In some places, I noticed NIH syndrome (Not Invented Here), with vibe-coded solutions instead of existing tools.

Because of this, the whole thing looks like a super over-engineered solution tailored to one specific person (the developer), ignoring the fact that different people need different things.

## What I Would Do Differently

I would extract the core that absolutely everyone needs. Which I actually did. My [Capsules](/blog/2026/01/capsules-isolated-environments-for-ai-agents/) are exactly about this. Then I would let the bot grow and develop itself.

This actually looks like a solution to my problem of agent interaction in Capsules. Instead of some unified supervisor orchestrating everything, I can let agents self-develop and interact with each other.

To demonstrate how Capsules work, I could launch my own personal assistant bot (similar to Clawdbot) running on Capsules with my own vision. In my vision, the bot-assistant doesn't create other systems itself. Instead, it provides communication between the user (the [botlord](/blog/2026/01/botlord-human-as-corporation/)) and other agents. And possibly other people through their assistants.

I see the core as super minimal. Just a chat through which you can give commands for self-improvement. Through this chat, you configure the bot itself. Self-development. The goal is to get a working companion in seconds and then tune its capabilities over time, including various access interfaces.

This resonates with my idea to use [Nix](https://nixos.org/) for describing Capsules. In this case, the bot can literally write itself.

My hypothesis is confirmed: Clawdbot takes off because it uses standard familiar interfaces (Telegram, Discord) and adds value on top of them. The interface matters. I expanded on this in [Small Steps Beat Big Leaps](/blog/2026/01/small-steps-beat-big-leaps-familiar-interfaces-win/).

{{< x >}}
