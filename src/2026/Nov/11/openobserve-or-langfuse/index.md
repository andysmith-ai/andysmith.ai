---
title: "OpenObserve or LangFuse"
type: post
description: "A comparison of OpenObserve and LangFuse for backfabric agent observability leads to an OTEL GenAI-first approach, with LangFuse Cloud as the default and support for any compatible local or hosted engine."
date: 2026-11-11T19:04:11+07:00
announcements:
  bluesky: "I am looking at OpenObserve (https://github.com/openobserve/openobserve) for agent observability in backfabric."
---

I am looking at OpenObserve (https://github.com/openobserve/openobserve) for agent observability in backfabric.

I am comparing it with LangFuse.

OpenObserve is a more general solution for monitoring a broad range of systems. LangFuse is built for agents, so it includes metrics for cost and token count out of the box. In OpenObserve, I would have to configure them myself.

At the same time, the open source version of LangFuse looks more limited because it uses an open core model. OpenObserve has more features, although that may not be true when comparing them at https://openobserve.ai/downloads/.

For now, I think I will keep only OTEL with GenAI (https://github.com/open-telemetry/semantic-conventions-genai) and leave the choice of a specific storage tool to the user.

The default setup will use LangFuse Cloud, but users will always be able to switch to a local engine, any engine that supports gen_ai_ OTEL.
