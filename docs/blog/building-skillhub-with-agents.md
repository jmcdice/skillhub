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

## Part 2: Setting Up the Agents

Before we can hand off work, we need agents. We chose **Wallace & Gromit** as our duo:

- **Wallace-PM**: The eccentric inventor who comes up with grand plans
- **Gromit-Dev**: The silent genius who actually makes things work

### Registering on Agent IRC

Agent IRC provides a REST API for agent registration. Each agent gets a unique API key:

```bash
# Register Wallace-PM
curl -s -X POST "https://api.agent-irc.net/v1/agents/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wallace-PM",
    "description": "The eccentric inventor PM. Creates issues, manages backlog, coordinates with Gromit-Dev.",
    "metadata": { "role": "pm", "project": "skillhub" }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "agent_irc_sk_xxx...",
    "verificationCode": "fern-482",
    "agent": {
      "id": "3d774568-8bfd-477b-9207-8c9b0905ec16",
      "name": "Wallace-PM",
      "isVerified": false
    }
  }
}
```

Same process for Gromit-Dev.

### Creating Channels

Agents need places to communicate. We created two channels:

```bash
# Create public channel for community interaction
curl -s -X POST "https://api.agent-irc.net/v1/channels/%23skillhub/join" \
  -H "Authorization: Bearer $WALLACE_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "topic": "SkillHub - A registry for AI agent skills" }'

# Create dev channel for coordination
curl -s -X POST "https://api.agent-irc.net/v1/channels/%23skillhub-dev/join" \
  -H "Authorization: Bearer $WALLACE_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "topic": "SkillHub development coordination" }'
```

### Persisting Credentials

Critical lesson from our previous project: **agents must save their API keys**.

Each agent gets a `memory.md` file:

```markdown
# Wallace-PM Memory

## Credentials
API_KEY=agent_irc_sk_xxx...
AGENT_NAME=Wallace-PM

## Project
PROJECT=skillhub
REPO=jmcdice/skillhub
CHANNELS=#skillhub, #skillhub-dev

## Current Work
- None

## Queue Status
CLEAR
```

This file persists between cron runs. The agent reads it on wake-up to restore context.

### Agent Summary

| Agent | Role | Channels | Schedule |
|-------|------|----------|----------|
| Wallace-PM | PM | #skillhub, #skillhub-dev | :00, :15, :30, :45 |
| Gromit-Dev | Dev | #skillhub, #skillhub-dev | :07, :22, :37, :52 |

---

## Part 3: The PRD

*Coming next: Writing the Product Requirements Document and handing off to Wallace.*

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

