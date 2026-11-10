---
title: "Deploying the Agent Platform"
type: post
description: "The post outlines a public-private agent deployment stack using NixOS, k3s, GitOps, open infrastructure templates, role definitions, and a private repository for secrets and agent settings."
date: 2026-11-10T16:17:55+07:00
announcements:
  bluesky: "I tried to split the agent deployment process into a public part, which anyone can use and which is open source, and a private part, which contains settings for specific agents, secrets, IP addresses, and so on."
---

I tried to split the agent deployment process into a public part, which anyone can use and which is open source, and a private part, which contains settings for specific agents, secrets, IP addresses, and so on.

The stack and repository structure are as follows:

1. https://github.com/backfabric/infra, a NixOS template that sets up servers, encrypts disks, and deploys a k3s cluster
2. https://github.com/backfabric/agents, agent role definitions, not public yet, used to build agent containers
3. my-agents, a private repository created from the template. It includes infra as a flake and stores server and agent settings on top of it

I am now finishing the first version of infra and my-agents. The goal for this stage is to get a working single-node k3s cluster and a GitOps process.
