---
title: "OpenFGA for Agent Authorization"
type: post
description: "Considering OpenFGA to define which agents can access one another, while enforcing external resource restrictions through per-agent tokens and prioritizing a working setup before refining permission automation."
date: 2026-11-14T23:13:20+07:00
announcements:
  bluesky: "I am considering openfga.dev as a tool for agent authorization."
---

I am considering openfga.dev as a tool for agent authorization.

The problem this tool solves is similar to what Google Zanzibar does. They say it inspired them. It handles authorization, which in my case means defining permissions for each agent in the system, specifically which other agents each of my agents can access.

For external restrictions, such as which repositories an agent can access, it is more convenient to enforce them at the token level. Each agent has its own token, with restrictions set when the token is created. When I automate token creation, I may come up with a way to describe permissions in code. That may require a more complex and general solution.

But for now, I want to get the agents running under the new setup in any form, then improve it. This iteration is taking too long.

![](https://files.andysmith.ai/img/73258b0f88014029d214f615992953402891a9249c0d7211e3ab677c9858e50c/h1pyvoxve3ubhhtk.png)
