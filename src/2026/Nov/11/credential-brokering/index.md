---
title: "Credential brokering"
type: post
description: "A look at credential brokering for AI agents, using placeholders, gateways, sidecars, or forwarded GPG/SSH agents to keep secrets hidden while enabling API calls, signing, decryption, and SSH access."
date: 2026-11-11T17:32:29+07:00
announcements:
  bluesky: "One very important issue is how an agent handles secrets."
---

One very important issue is how an agent handles secrets.

The problem is that if an agent has access to secrets, it can “steal” them. It can leak them to an inference or telemetry provider, to an attacker through prompt injection, or even publish them by accident, although I honestly have not seen the last case.

This does not secure what the agent can do with these secrets. For example, if the agent has an API key for a service, it can do anything there within the permissions of that key. This only solves the problem of the agent having access to the key itself.

The solution is for the agent not to know the actual secrets. Instead, it works with “placeholders” that contain only the names of the secrets. A separate module substitutes the secrets, and the agent has no access to that module. This is called the credential brokering pattern: https://developer.hashicorp.com/boundary/docs/concepts/credential-management.

I see two main ways to implement this pattern in my backfabric agent platform:

1. For network secrets, mostly when calling an API with a key, I can use a gateway that inserts the key, such as https://github.com/paradigmxyz/iron-proxy)
2. For cases where the key is needed locally, such as signing, decryption, or even connecting over SSH, I either run a separate sidecar that stores the secrets and only exposes a decryption service. The agent can decrypt text without having access to the key. Or, as a more complex option, I forward a GPG/SSH agent into the pod. In this case, the agent can use the key but cannot export it. Standard tools such as OpenBAO do not support this.
