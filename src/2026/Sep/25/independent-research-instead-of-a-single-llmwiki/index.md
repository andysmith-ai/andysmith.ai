---
title: "Independent research instead of a single llmwiki"
type: post
description: "After a single agent-written research wiki became unmanageable, the author shifts to autonomous public or private GitHub repositories for each research thread, linked through a lightweight central index."
date: 2026-09-25T15:32:32+07:00
announcements:
  telegram: "I tried to build smith.wiki as the single llmwiki, aka Zettelkasten, for all my research. Within just two days, it turned into a mess that was impossible to navigate."
  bluesky: "I tried to build smith.wiki as the single llmwiki, aka Zettelkasten, for all my research. Within just two days, it turned into a mess that was impossible to navigate."
---

I tried to build smith.wiki as the single llmwiki, aka Zettelkasten, for all my research. Within just two days, it turned into a mess that was impossible to navigate.

I think this is because an agent writes far more than a person, or even another agent, can read and review. Garbage multiplies on an unprecedented scale.

Now I am trying a new setup. I publish each independent research thread as a repository in the smith-wiki GitHub organization. Since the CNAME is set in the main repository, all repositories are automatically published at smith.wiki/<reponame>. A repository can be public or private. The old setup did not allow private research.

The main index only provides a list of research projects and possibly a general index, such as a list of pages in each project. The research projects themselves are autonomous and can use any structure.
