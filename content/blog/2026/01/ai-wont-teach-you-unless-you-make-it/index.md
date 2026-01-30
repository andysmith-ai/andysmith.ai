---
title: "AI Won't Teach You — Unless You Make It"
description: "AI accelerates work where you're already an expert but may hinder you from becoming one. How to learn new skills when AI always wants to do everything for you."
date: 2026-01-30T09:48:12
featured_image: featured.png
images: ["image.png"]
twitter_discussion: "https://x.com/andysmith_ai/status/2017174373946282247"
---

I've been reading Anthropic's research on the [problems with AI assistance when acquiring new skills](https://www.anthropic.com/research/AI-assistance-coding-skills) ([arXiv paper](https://arxiv.org/abs/2601.20245)).

The hypothesis: AI accelerates your work where you're already an expert but hinders you from becoming an expert in something new. If you fully delegate tasks to AI, you start to get dumber and eventually become obsolete.

At first glance, this contradicts my post on [autonomy with acceptable quality](/blog/2026/01/autonomy-with-acceptable-quality/), but it doesn't. In that post, I was discussing autonomous task completion, not learning something new. I set the tasks myself, which means I already have some understanding of what needs to be done and how to evaluate the result.

But what do you do when you lack that understanding? How should AI help you learn when it always wants to do everything itself?

The research suggests these approaches:

1. Discuss conceptual options but write the code yourself
2. Generate code and ask for explanations

The key point: you need to put in the effort, to think. That's when learning happens. If you just mindlessly delegate task solutions to AI, you won't learn anything.

## My Approach

I usually take a different path when learning something new or building fundamentally new (for me) systems. These are tasks I can't yet fully delegate to autonomous AI:

1. **Problem formulation:** Define what needs to be done and how to evaluate the result
2. **Research:** Gather all possible solutions, existing technologies, tools, and practices. Compare and choose
3. **Architectural decomposition:** Together with AI, I build an understanding of how the finished system will work. It's crucial for me to actually understand what the result will be because I'm responsible for the decision made and implemented. I'll need to review and accept the result. This is, in my view, the key difference from mindless vibe coding. Without this understanding, there's no way to take responsibility for the outcome, and the result may or may not work out
4. **Documentation/tests preparation** based on the discussion above. AI formulates, I carefully reread these documents and make many changes. This is where my understanding and AI's understanding synchronize
5. **Writing code:** Here I mostly trust the AI. I only review the most critical parts, but I believe verification should be automated through tests (including architectural ones) and possibly other methods (formal verification)
6. **Verification:** Automated through tests
7. **Acceptance:** Still manual, but this needs to be automated too
8. **Debugging:** Automated by AI, but it's important to engage rather than just copy-paste errors. I always require descriptions of error causes and read them to understand what actually happened

After going through this cycle for the first time, I can extract this class of tasks into an autonomous solver that will do all of this next time without me.

**Understanding is the key** in this process. Without understanding, you have problems.

## Is Shallow Understanding Really a Problem?

Maybe it's becoming the new normal? Maybe I'm the odd one? After all, Anthropic didn't put an abacus in the header image for nothing. Who knows how to use an abacus in 2026? Who even remembers what it is?

Building AI systems to work reliably is also a skill you can learn (including experimentally), putting in effort and making mistakes. So this also needs to be done, which is exactly what I'm doing and describing in this blog.

But as usual, the truth is somewhere in the middle. Both matter.

{{< x >}}
