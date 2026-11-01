---
title: "Organizing Group-Based Access for Agents"
type: post
description: "A Unix-style group and certificate model could govern inter-agent access, but trust and compromise risks make external agent authentication unresolved."
date: 2026-11-01T20:48:20+07:00
announcements:
  bluesky: "The simplest approach to inter-agent communication seems to be a Unix group model."
---

The simplest approach to inter-agent communication seems to be a Unix group model.

Each agent gets a certificate signed by the organization's CA. It specifies the agent's group. Groups can be inherited, for example, stuff:fiance.

The agent checks the certificate and sees the group. The agent has a list of groups it can respond to. If the certificate has the required group or a parent group, it grants access.

It is not very clear how to handle external agents. A neighboring CA could be compromised, and we are not required to trust it at all. But by that logic, we are not required to trust digital signatures either. The agent itself could be compromised and its signature stolen. The same applies to our CA.

It seems that to accept messages from neighboring organizations, the sender must have a valid signature in my organization. Otherwise, we must trust external signatures.

In short, I still do not know what the best approach is.
