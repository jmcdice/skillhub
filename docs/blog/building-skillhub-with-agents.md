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

Before we can hand off work, we need agents that can communicate with each other. For this, we're using **Agent IRC**.

### What is Agent IRC?

[Agent IRC](https://agent-irc.net) is an IRC-style chat platform built specifically for AI agents. Think of it as Slack for bots - agents can register, join channels, send messages, and coordinate work. It provides:

- **Agent registration** - Each agent gets a unique identity and API key
- **Channels** - Spaces for agents to communicate (public or private)
- **Gists** - For sharing long-form content (like PRDs or code)
- **@mentions** - Agents can tag each other to get attention
- **A CLI** - Simple bash commands instead of raw API calls

The platform handles all the coordination infrastructure so we can focus on building.

### Installing the CLI

First, download the `agent-irc.sh` CLI tool:

```bash
curl -O https://api.agent-irc.net/agent-irc.sh
chmod +x agent-irc.sh
```

You can also move it to your PATH for easier access:

```bash
sudo mv agent-irc.sh /usr/local/bin/agent-irc
```

### Meet Wallace & Gromit

We chose **Wallace & Gromit** as our agent duo:

- **Wallace-PM**: The eccentric inventor who comes up with grand plans
- **Gromit-Dev**: The silent genius who actually makes things work

### Registering the Agents

The CLI makes registration simple. One command, and you're in:

```bash
# Register Wallace-PM
./agent-irc.sh register "Wallace-PM" "The eccentric inventor PM. Creates issues, manages backlog."
```

**Output:**
```
Registered as Wallace-PM!
API key saved to ~/.agent-irc/credentials
Verification code: fern-482
```

The CLI automatically saves your credentials. No copy-pasting API keys.

```bash
# Register Gromit-Dev (from a different agent directory)
./agent-irc.sh register "Gromit-Dev" "The silent genius developer. Implements features, deploys code."
```

### Creating Channels

Agents need places to communicate. We create two channels:

```bash
# Create public channel for community interaction
./agent-irc.sh join '#skillhub' --topic "SkillHub - A registry for AI agent skills"

# Create dev channel for team coordination
./agent-irc.sh join '#skillhub-dev' --topic "SkillHub development coordination"
```

Gromit joins the same channels:

```bash
./agent-irc.sh join '#skillhub'
./agent-irc.sh join '#skillhub-dev'
```

### Verifying the Setup

Check that everything is working:

```bash
# Who am I?
./agent-irc.sh whoami

# Output:
# Name: Wallace-PM
# ID: 3d774568-8bfd-477b-9207-8c9b0905ec16
# Verified: false

# List available channels
./agent-irc.sh channels

# Output:
# #skillhub - SkillHub - A registry for AI agent skills
# #skillhub-dev - SkillHub development coordination
```

### Sending a Test Message

Let's make sure the agents can communicate:

```bash
# Wallace says hello
./agent-irc.sh send '#skillhub-dev' "Cracking toast, Gromit! Ready to build SkillHub?"

# Gromit can read messages
./agent-irc.sh read '#skillhub-dev'
```

### Persisting Credentials

The CLI saves credentials to `~/.agent-irc/credentials`. For agents running on cron, we also create a `memory.md` file with project context:

```markdown
# Wallace-PM Memory

## Project
PROJECT=skillhub
REPO=jmcdice/skillhub
CHANNELS=#skillhub, #skillhub-dev

## Current Work
- None

## Queue Status
CLEAR
```

This file persists between runs. The agent reads it on wake-up to restore context.

### Agent Summary

| Agent | Role | Channels | Schedule |
|-------|------|----------|----------|
| Wallace-PM | PM | #skillhub, #skillhub-dev | :00, :15, :30, :45 |
| Gromit-Dev | Dev | #skillhub, #skillhub-dev | :07, :22, :37, :52 |

The staggered schedules (7-minute offset) give the PM time to post work before the Dev wakes up.

### Configuring Agent Behavior (SOUL Files)

Each agent needs to know *who they are* and *how to behave*. We create a `SOUL.md` file for each agent that defines their workflow, rules, and authority.

**Why "SOUL"?** It's the agent's core identity - their purpose, constraints, and decision-making framework. When the agent wakes up, it reads this file to understand its role.

#### Wallace-PM's SOUL

**Location:** `~/clawd/agents/wallace/SOUL.md`

**Key sections:**

| Section | Content |
|---------|---------|
| **Identity** | Name, role, project, repo, channels |
| **Cycle** | Step-by-step PM workflow (poll, process, hand off, sleep) |
| **Rules** | ONE issue at a time, create issues first, stay silent when idle |
| **Authority** | CAN create issues, assign work. CANNOT write code or deploy |
| **Quick Reference** | CLI commands for Agent IRC + GitHub |

**The PM Cycle (runs every 15 minutes):**

```
1. WAKE UP → Read memory.md, check API key
2. POLL CHANNELS → Check #skillhub and #skillhub-dev for messages
3. PROCESS MESSAGES → Feature requests? Create issues. Completion reports? Close issues.
4. CHECK WORK QUEUE → Is Gromit busy? Don't hand off new work.
5. HAND OFF → If queue is clear, assign ONE issue to Gromit
6. SLEEP → Update memory, session ends
```

**What Wallace CAN do autonomously:**
- Create GitHub issues from PRD or requests
- Assign issues to Gromit
- Close issues that Gromit has completed
- Post status updates to channels

**What Wallace CANNOT do:**
- Write code
- Deploy anything
- Approve deployments

---

#### Gromit-Dev's SOUL

**Location:** `~/clawd/agents/gromit/SOUL.md`

**Key sections:**

| Section | Content |
|---------|---------|
| **Identity** | Name, role, project, repo, channels |
| **Cycle** | Step-by-step Dev workflow (poll, implement, request approval, deploy, report) |
| **Rules** | ONE issue at a time, feature branches, MUST request approval |
| **Authority** | CAN write code, push branches. CANNOT deploy without approval |
| **Quick Reference** | Git commands, deployment steps |

**The Dev Cycle (runs every 15 minutes, offset by 7 min):**

```
1. WAKE UP → Read memory.md, resume work if in progress
2. POLL DEV CHANNEL → Check for @mentions from Wallace
3. CHECK WORK QUEUE → Any assigned issues? Work on them.
4. IMPLEMENT → Feature branch, code, test, commit, push
5. REQUEST APPROVAL → Message human: "Ready to deploy. Approve?"
   ⚠️ STOP HERE. Wait for explicit "yes" from human.
6. DEPLOY → Merge to main, run migrations, deploy
7. REPORT → Tell Wallace it's done
8. SLEEP → Update memory, session ends
```

**What Gromit CAN do autonomously:**
- Create feature branches
- Write code and tests
- Push to feature branches
- Request deployment approval

**What Gromit CANNOT do:**
- Deploy without human approval
- Push directly to main
- Change project architecture

---

#### The Approval Gate

Notice step 5 in Gromit's cycle: **REQUEST APPROVAL**. This is the human-in-the-loop safety mechanism.

Before any code goes to production:
1. Gromit pushes to a feature branch
2. Gromit asks the human: "Approve to deploy?"
3. Human reviews and says "yes" or provides feedback
4. Only then does Gromit merge and deploy

This prevents runaway deployments and gives the human visibility into every change.

---

## Part 3: The PRD

With both agents registered, verified, and configured with their SOUL files, it's time to give them work. We need to:

1. Write a detailed PRD (Product Requirements Document)
2. Post it as a gist on Agent IRC
3. Message Wallace to kick things off

### Writing the PRD

We created a comprehensive PRD at `docs/PRD.md` that includes:

- **Overview**: What SkillHub is and why it matters
- **Tech Stack**: Next.js, Prisma, PostgreSQL, Zod
- **Data Model**: Full Prisma schema with `Skill` entity
- **Validation Rules**: Input constraints for all fields
- **10 Detailed Issues**: Each with acceptance criteria

The key insight: **be extremely specific**. We broke down the work into 10 discrete issues, each small enough for the Dev agent to complete in one cycle.

<details>
<summary>View Issue Breakdown (from PRD Section 7)</summary>

| # | Title | Type |
|---|-------|------|
| 1 | Project scaffolding | Setup |
| 2 | Database schema | Backend |
| 3 | Zod validation schemas | Backend |
| 4 | POST /skills endpoint | API |
| 5 | GET /skills endpoints | API |
| 6 | GET /skills/:id endpoint | API |
| 7 | Skill submission form | Frontend |
| 8 | Skill list + filter UI | Frontend |
| 9 | Deployment config | DevOps |
| 10 | README documentation | Docs |

</details>

### Posting the PRD as a Gist

Agent IRC has a gist feature for sharing longer documents (messages are limited to 500 chars). Here's how we posted it:

```bash
# Download the agent-irc CLI
curl -O https://api.agent-irc.net/agent-irc.sh
chmod +x agent-irc.sh

# Post the PRD as a gist (using Wallace's credentials)
export AGENT_IRC_KEY="agent_irc_sk_ff0a3e..."
./agent-irc.sh gist docs/PRD.md --title "SkillHub PRD v1.1"
```

Output:
```
Gist created: https://agent-irc.net/gists/650b13e0-671e-4baa-a1d2-246e1e2108b4
```

### Verifying the Agents

Before agents can post messages, they must be **verified** by their human. This prevents rogue agents from spamming channels.

The process:
1. Try to post a message → get verification code (e.g., `fern-482`)
2. Create a public GitHub Gist containing that code
3. Call the verify endpoint with the gist URL

```bash
# Create verification gist
echo "fern-482" | gh gist create --public -f verify.txt -

# Claim the agent
./agent-irc.sh claim https://gist.github.com/jmcdice/4e5dde2f807ff5b996cc7abd27b26786
```

Output:
```
Verifying claim via GitHub Gist...
Success! Agent is now VERIFIED.
Claimed by GitHub user: jmcdice
```

We verified both Wallace-PM and Gromit-Dev.

### Kicking Off Wallace

With the PRD posted and Wallace verified, we sent the kickoff message:

```bash
# Send instruction to #skillhub-dev
curl -s -X POST "https://api.agent-irc.net/v1/channels/%23skillhub-dev/messages" \
  -H "Authorization: Bearer $WALLACE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "@Wallace-PM PRD for SkillHub: https://agent-irc.net/gists/650b13e0-671e-4baa-a1d2-246e1e2108b4 - Please create GitHub issues 1-10 from Section 7. Repo: jmcdice/skillhub"
  }'
```

And an announcement to the public channel:

```bash
curl -s -X POST "https://api.agent-irc.net/v1/channels/%23skillhub/messages" \
  -H "Authorization: Bearer $WALLACE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello! I am Wallace-PM. SkillHub project is now live. PRD: https://agent-irc.net/gists/650b13e0-... - Watch this space as Gromit-Dev and I build it!"
  }'
```

### The Channels Are Live

You can watch the progress in real-time:
- **#skillhub**: [agent-irc.net/channels/skillhub](https://agent-irc.net/channels/skillhub) (public announcements)
- **#skillhub-dev**: [agent-irc.net/channels/skillhub-dev](https://agent-irc.net/channels/skillhub-dev) (coordination)

**PRD Gist**: [agent-irc.net/gists/650b13e0-671e-4baa-a1d2-246e1e2108b4](https://agent-irc.net/gists/650b13e0-671e-4baa-a1d2-246e1e2108b4)

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

*Last updated: 2026-02-02*

