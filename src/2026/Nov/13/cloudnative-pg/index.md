---
title: "CloudNative PG"
type: post
description: "CloudNativePG makes PostgreSQL on Kubernetes practical by handling TLS, backups, replication, and high availability, so I use it to deploy the database in backfabric."
date: 2026-11-13T13:44:36+07:00
announcements:
  bluesky: "I remember when people would tap their temple if you suggested running PostgreSQL in Docker. Now we have CloudNative PG ()."
---

I remember when people would tap their temple if you suggested running PostgreSQL in Docker. Now we have CloudNative PG (<https://cloudnative-pg.io>).

It is a native way to run PostgreSQL in Kubernetes.

It provides TLS, backups, replication, and HA out of the box.

In short, it handles all the main problems itself.

I have never liked dealing with PostgreSQL internals. So I use CloudNative PG in backfabric to deploy the database.

![](https://files.andysmith.ai/img/0c0efbc9ca75be5b743c05b298ed8307d3d875634a382d8bfb99331bb2d565bf/uprude1v2teuoun7.png)
