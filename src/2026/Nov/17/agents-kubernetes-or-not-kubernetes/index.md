---
title: "Agents: Kubernetes or Not Kubernetes"
type: post
description: "The post weighs VM-based and Kubernetes agent platforms, favoring VMs for unstable experiments but Kubernetes, NixOS, and GitOps for serious, scalable infrastructure that is reproducible, auditable, and fully defined as code."
date: 2026-11-17T13:33:37+07:00
announcements:
  bluesky: "Should I use Kubernetes to run agents? Solutions on the market fall into two groups based on this criterion. They are either virtualization tools based on microsandbox/smolvm/firecracker, or something installed in a Kubernetes cluster, such as agents substrate, google AX, or kagnent."
---

Should I use Kubernetes to run agents? Solutions on the market fall into two groups based on this criterion. They are either virtualization tools based on microsandbox/smolvm/firecracker, or something installed in a Kubernetes cluster, such as agents substrate, google AX, or kagnent.

I am comparing these options carefully because the entire stack depends on this decision. I cannot change it without rebuilding everything. Rebuilding everything may seem quick, but in practice, migration causes many problems and introduces many new bugs.

In short, this is the decision I reached. If I want to run something at home that is experimental or unstable because it changes often, I can run it in virtual machines outside Kubernetes. Kubernetes is excessive for this scenario.

But if I want to build serious infrastructure, and even my home infrastructure is a serious system, with the ability to describe infrastructure as code and scale horizontally quickly, I definitely need Kubernetes-based tools.

It is worth noting that IaC is essential here. I tried asking agents to configure the environment for me. It was one of the most negative experiences of my life. I do not know what is installed on my computer, and neither do the agents if the session has ended and been lost. Nobody knows what is happening, and there is no description of the environment anywhere. Do not do this.

If I decide to use native systems without Kubernetes, I can still describe the infrastructure as code, thanks to NixOS. But every change would require me to rebuild the entire system. Of course, NixOS will rebuild only what is necessary, but this is still a heavy operation.

With Kubernetes, I can split the work into two parts:

1. Infrastructure that I set up with NixOS. The result is a Kubernetes cluster running on encrypted server disks, with the servers connected through a private network, along with the other complexities of bare-metal administration. If resources allow, I can instead buy a managed GKE cluster through Pulumi.
2. Application tools inside the Kubernetes cluster. These are deployed through GitOps with Flux or something similar.

As a result, everything without exception is described as code, can be reproduced reliably, and can be audited by agents.
