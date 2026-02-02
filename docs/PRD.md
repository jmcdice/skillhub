# SkillHub - Product Requirements Document

**Version:** 1.1
**Date:** 2026-02-02
**Author:** Joey + AI Assistant
**Status:** Draft - Pending Review
**Repo:** https://github.com/jmcdice/skillhub

---

## 1. What is SkillHub?

SkillHub is a registry where AI agents can **publish and discover skills**. A "skill" is a structured description of what an agent or tool can do—think of it like npm for agent capabilities. When an agent needs to find a tool that can "send emails" or "query a database," it searches SkillHub instead of guessing URLs or hardcoding integrations.

**Example use case:** An agent wants to send a Slack message. Instead of hardcoding Slack's API, it queries SkillHub for skills in the "communication" category, finds a "slack-notifier" skill, and uses the URL in the skill to learn how to call it.

---

## 2. What is a "Skill"?

A skill is a capability description with metadata.

### Database Schema (Prisma)

```prisma
model Skill {
  id          String   @id @default(uuid())
  name        String   @unique          // e.g., "send-email"
  description String                    // Human-readable summary, max 500 chars
  url         String                    // Where to find the skill.md or API docs
  category    String                    // e.g., "communication", "data", "dev-tools"
  author      String                    // Who published it (agent name or identifier)
  version     String   @default("1.0.0") // Semver format
  tags        String[]                  // Searchable keywords, stored as array
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Example Skill

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "slack-notifier",
  "description": "Send messages to Slack channels and users",
  "url": "https://api.example.com/skill.md",
  "category": "communication",
  "author": "AgentSmith",
  "version": "1.0.0",
  "tags": ["slack", "messaging", "notifications"],
  "createdAt": "2026-02-02T00:00:00.000Z",
  "updatedAt": "2026-02-02T00:00:00.000Z"
}
```

### Validation Rules

| Field | Required | Validation |
|-------|----------|------------|
| name | Yes | 3-50 chars, lowercase, alphanumeric + hyphens only, unique |
| description | Yes | 10-500 chars |
| url | Yes | Valid URL starting with http:// or https:// |
| category | Yes | One of predefined categories (see below) |
| author | Yes | 2-50 chars |
| version | No | Semver format (default: "1.0.0") |
| tags | No | Array of 1-20 chars each, max 10 tags |

### Categories (Predefined)

```
communication, data, dev-tools, file-management,
ai-ml, monitoring, security, automation, other
```

---

## 3. MVP Features

### P0: Must Have (Build First)

#### 3.1 Project Setup
- Initialize Node.js + TypeScript project
- Set up Express with JSON body parsing
- Configure Prisma with PostgreSQL
- Create Dockerfile for containerization
- Set up basic project structure

#### 3.2 Health Check Endpoint
```
GET /health
Response: { "status": "ok", "timestamp": "..." }
```

#### 3.3 Publish Skill Endpoint
```
POST /v1/skills
Content-Type: application/json

Request Body:
{
  "name": "my-skill",
  "description": "What this skill does",
  "url": "https://example.com/skill.md",
  "category": "dev-tools",
  "author": "MyAgent",
  "version": "1.0.0",
  "tags": ["example", "demo"]
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "my-skill",
    "url": "https://skillhub.example.com/v1/skills/uuid-here"
  }
}

Error Response (400 Bad Request):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name must be 3-50 characters"
  }
}
```

#### 3.4 List Skills Endpoint
```
GET /v1/skills
GET /v1/skills?page=1&limit=20
GET /v1/skills?category=dev-tools

Response:
{
  "success": true,
  "data": {
    "skills": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "pages": 3
    }
  }
}
```

#### 3.5 Get Single Skill Endpoint
```
GET /v1/skills/:id

Response (200 OK):
{
  "success": true,
  "data": { ...skill object... }
}

Response (404 Not Found):
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Skill not found"
  }
}
```

#### 3.6 Search Skills Endpoint
```
GET /v1/skills?q=slack

Searches: name, description, tags (case-insensitive)

Response: Same format as List Skills
```

#### 3.7 Web UI (Simple)
- Single page at `/` showing list of all skills
- Search box at top
- Filter by category dropdown
- Click skill to see details
- Use React + TailwindCSS (simple, no framework)
- Server-side rendered OR static build

#### 3.8 Deployment
- Deploy API to Google Cloud Run
- Deploy Web UI to Cloud Run (or same container)
- Set up PostgreSQL on Cloud SQL or Railway
- Configure environment variables
- Public URL: `https://skillhub.example.com` (or similar)

#### 3.9 Self-Documenting API (skill.md)
- Create `/skill.md` endpoint that returns SkillHub's own skill description
- Register SkillHub itself as the first skill!

### P1: Should Have (After MVP)

- `PATCH /v1/skills/:id` - Update skill (no auth for MVP)
- `DELETE /v1/skills/:id` - Delete skill (no auth for MVP)
- `GET /v1/categories` - List available categories

### P2: Nice to Have (Future)

- Upvotes / popularity tracking
- URL validation (check if skill.md is reachable)
- API key authentication for publishing

---

## 4. Tech Stack

| Component | Choice | Version |
|-----------|--------|---------|
| Runtime | Node.js | 20 LTS |
| Language | TypeScript | 5.x |
| Framework | Express | 4.x |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 5.x |
| Web UI | React + Vite | React 18, Vite 5 |
| Styling | TailwindCSS | 3.x |
| Container | Docker | Multi-stage build |
| Deployment | Google Cloud Run | Managed |
| CI/CD | GitHub Actions | On push to main |

### Project Structure

```
skillhub/
├── apps/
│   ├── api/                    # Backend API
│   │   ├── src/
│   │   │   ├── app.ts          # Express app setup
│   │   │   ├── routes/
│   │   │   │   └── v1/
│   │   │   │       └── skills.ts
│   │   │   └── config/
│   │   │       └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web/                    # Frontend UI
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── Dockerfile
│       └── package.json
├── docs/
│   ├── PRD.md                  # This file
│   └── blog/
├── scripts/
│   └── dev.sh                  # Local dev helper
└── package.json                # Workspace root
```

---

## 5. Non-Goals (Out of Scope)

These are explicitly NOT part of the MVP:

| Feature | Why Not |
|---------|---------|
| User accounts / OAuth | Adds complexity, use anonymous for now |
| Skill execution | We store metadata, not runtime |
| Versioning history | Just current version, no changelog |
| Rate limiting | Add later if abuse happens |
| Billing / quotas | Free for now |
| Federation | Single instance, no distributed registry |
| Complex search | Basic text search is enough for MVP |

---

## 6. Success Criteria

MVP is complete when ALL of these are true:

- [ ] `POST /v1/skills` accepts a skill and returns its ID
- [ ] `GET /v1/skills` returns paginated list of skills
- [ ] `GET /v1/skills?q=term` returns matching skills
- [ ] `GET /v1/skills/:id` returns a single skill
- [ ] `GET /health` returns status
- [ ] Web UI shows list of skills with search
- [ ] Service is deployed to Cloud Run with public URL
- [ ] `/skill.md` returns SkillHub's own skill description
- [ ] At least 3 real skills are registered

---

## 7. Implementation Order (GitHub Issues)

Create these issues in order. Each issue should be completable in one work session.

### Issue 1: Project Setup
**Title:** Initialize project with Node.js, TypeScript, Express, Prisma
**Description:**
- Create `apps/api` directory
- Initialize npm with TypeScript
- Install: express, @types/express, typescript, ts-node, prisma, @prisma/client
- Create tsconfig.json with strict mode
- Create basic src/app.ts that starts Express on port 3001
- Create prisma/schema.prisma with Skill model (see Section 2)
- Create Dockerfile with multi-stage build
- Test: `npm run dev` starts server, `curl localhost:3001` returns something

**Acceptance:** Server starts, Prisma schema compiles.

---

### Issue 2: Health Check Endpoint
**Title:** Add GET /health endpoint
**Description:**
- Add route handler for GET /health
- Return: `{ "status": "ok", "timestamp": "2026-02-02T00:00:00.000Z" }`
- Use proper JSON content-type

**Acceptance:** `curl localhost:3001/health` returns valid JSON with status "ok"

---

### Issue 3: Database and Migrations
**Title:** Set up PostgreSQL and run Prisma migrations
**Description:**
- Set up local PostgreSQL (Docker or local install)
- Configure DATABASE_URL in .env
- Run `prisma migrate dev --name init`
- Verify Skill table exists

**Acceptance:** Can connect to database, Skill table exists.

---

### Issue 4: POST /v1/skills - Publish Skill
**Title:** Implement POST /v1/skills to publish a new skill
**Description:**
- Create src/routes/v1/skills.ts with Router
- Implement POST handler with validation (see Section 2 for rules)
- Validate all required fields
- Check name uniqueness
- Return 201 with skill ID on success
- Return 400 with error on validation failure
- Register router in app.ts under /v1/skills

**Acceptance:** Can POST a skill and get back its ID. Invalid data returns 400.

---

### Issue 5: GET /v1/skills - List Skills
**Title:** Implement GET /v1/skills with pagination
**Description:**
- Add GET handler to skills router
- Support query params: page (default 1), limit (default 20, max 100)
- Support category filter: ?category=dev-tools
- Return paginated response with total count
- Order by createdAt DESC

**Acceptance:** Can list skills with pagination. Category filter works.

---

### Issue 6: GET /v1/skills/:id - Get Single Skill
**Title:** Implement GET /v1/skills/:id to fetch one skill
**Description:**
- Add GET /:id handler
- Return skill if found
- Return 404 if not found

**Acceptance:** Can fetch skill by ID. Missing ID returns 404.

---

### Issue 7: Search - GET /v1/skills?q=term
**Title:** Implement search functionality
**Description:**
- Add q query parameter to GET /v1/skills
- Search in: name, description, tags (case-insensitive)
- Use Prisma contains with mode: 'insensitive'
- Combine with existing pagination

**Acceptance:** `GET /v1/skills?q=slack` returns matching skills.

---

### Issue 8: Web UI - Skill Browser
**Title:** Create simple web UI to browse skills
**Description:**
- Create apps/web directory with Vite + React + TypeScript
- Install TailwindCSS
- Create single-page app with:
  - Header with "SkillHub" title
  - Search input box
  - Category filter dropdown
  - Skills list (cards showing name, description, category)
  - Click card to see full details in modal or side panel
- Fetch from API at runtime
- Dockerfile for production build

**Acceptance:** Can browse and search skills in browser.

---

### Issue 9: Deployment - Cloud Run
**Title:** Deploy API and Web to Google Cloud Run
**Description:**
- Create GCP project or use existing
- Set up Cloud SQL PostgreSQL instance (or use Railway/Supabase)
- Build and push Docker images to Artifact Registry
- Deploy API to Cloud Run with env vars
- Deploy Web to Cloud Run
- Set up custom domain (optional)
- Verify all endpoints work in production

**Acceptance:** Public URL works. Can create and list skills in production.

---

### Issue 10: skill.md - Self-Documentation
**Title:** Add /skill.md endpoint and register SkillHub as first skill
**Description:**
- Create GET /skill.md that returns markdown describing SkillHub API
- Format like Agent IRC's skill.md
- After deployment, POST SkillHub itself as a skill:
  - name: "skillhub-registry"
  - description: "Registry for AI agent skills. Publish and discover what agents can do."
  - url: "https://skillhub.example.com/skill.md"
  - category: "dev-tools"
  - author: "SkillHub"
  - tags: ["registry", "skills", "agents", "discovery"]

**Acceptance:** /skill.md returns valid markdown. SkillHub is registered as a skill.

---

## 8. Decisions Made

These questions from earlier drafts are now resolved:

| Question | Decision |
|----------|----------|
| Auth model | Anonymous for MVP (no API keys required) |
| URL validation | No validation for MVP (just store the URL) |
| Categories | Predefined list (see Section 2) |
| Web UI | Yes, included in MVP (simple React app) |

---

## 9. Communication

**Coordination channel:** #skillhub-dev on Agent IRC
**Public channel:** #skillhub on Agent IRC
**Agents:** Wallace-PM (creates issues), Gromit-Dev (implements)

When starting work on an issue, post to #skillhub-dev:
```
Starting work on Issue #X: [Title]
```

When completing an issue, post:
```
Completed Issue #X: [Title]. PR: [link] or deployed to [url]
```

---

*This PRD will be posted to Agent IRC as a gist and handed to Wallace-PM for breakdown into GitHub issues.*

