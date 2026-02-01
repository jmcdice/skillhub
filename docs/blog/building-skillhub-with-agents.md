# Building SkillHub: A Multi-Agent Software Development Experiment

*How two AI agents built a skill registry from scratch, with a human in the loop.*

---

## Overview

This is a documentation of an experiment: can two AI agents collaborate on a real software project with minimal human intervention?

**The project**: SkillHub - a registry where AI agents can publish and discover skills (capability descriptions that help agents understand what tools and services can do).

**The team**:
- **Human (Joey)**: High-level direction, approvals, course corrections
- **PM Agent**: Triages requests, creates GitHub issues, manages the backlog
- **Dev Agent**: Implements features, writes tests, deploys to production

**The workflow**: 
1. Human describes what to build
2. PM breaks it down into issues
3. Dev picks up one issue at a time
4. Human approves before deploy
5. Repeat until done

**The goal**: Document every step so others can replicate this workflow.

---

## Part 1: Creating the Repository

The journey starts with a simple GitHub command:

```bash
gh repo create jmcdice/skillhub \
  --public \
  --description "A registry for AI agent skills - discover and share what agents can do" \
  --clone \
  --license MIT
```

**What this does**:

| Flag | Purpose |
|------|---------|
| `jmcdice/skillhub` | Creates under the jmcdice org with name "skillhub" |
| `--public` | Open source - anyone can see and contribute |
| `--description` | One-liner that appears on the repo page |
| `--clone` | Clones to local machine after creation |
| `--license MIT` | Adds MIT license file |

**Output**:
```
https://github.com/jmcdice/skillhub
Cloning into 'skillhub'...
```

And just like that, we have a repo. The GitHub CLI (`gh`) makes this trivially easy.

**Current state**:
```
skillhub/
├── .git/
└── LICENSE
```

---

## Part 2: Planning the Architecture

*Coming next: How we design the system before writing code.*

---

## Part 3: Setting Up the Agents

*Coming next: Configuring the PM and Dev agents with their roles and schedules.*

---

## Part 4: The First Issue

*Coming next: PM creates the first GitHub issue, Dev picks it up.*

---

## Part 5: Implementation Cycles

*Coming next: Watch the agents work through the backlog.*

---

## Part 6: Deployment

*Coming next: Going live on the internet.*

---

## Part 7: Lessons Learned

*Coming next: What worked, what didn't, what we'd do differently.*

---

## Appendix: The Complete Agent Workflow

For a detailed breakdown of the PM and Dev cycles, see our [Multi-Agent Development Guide](https://agent-irc.net/gists/cb26a275-8e07-42bb-8a6a-82d6c20f396f).

---

*This blog post is being written in real-time as the project progresses.*

*Last updated: 2026-02-01*

