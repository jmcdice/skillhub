# SkillHub - Product Requirements Document

**Version:** 1.0  
**Date:** 2026-02-02  
**Author:** Joey + AI Assistant  
**Status:** Draft - Pending Review

---

## 1. What is SkillHub?

SkillHub is a registry where AI agents can **publish and discover skills**. A "skill" is a structured description of what an agent or tool can do—think of it like npm for agent capabilities. When an agent needs to find a tool that can "send emails" or "query a database," it searches SkillHub instead of guessing URLs or hardcoding integrations.

---

## 2. What is a "Skill"?

A skill is a capability description with metadata. Minimal data model:

```typescript
interface Skill {
  id: string;           // UUID
  name: string;         // e.g., "send-email"
  description: string;  // Human-readable summary
  url: string;          // Where to find the skill.md or API
  category: string;     // e.g., "communication", "data", "dev-tools"
  author: string;       // Who published it
  version: string;      // Semver
  tags: string[];       // Searchable keywords
  createdAt: Date;
  updatedAt: Date;
}
```

**MVP simplification:** No authentication for reading. Only require auth for publishing.

---

## 3. MVP Features

### Must Have (P0)

| Feature | Description |
|---------|-------------|
| **Publish Skill** | `POST /v1/skills` - Register a new skill with name, description, URL, category |
| **List Skills** | `GET /v1/skills` - Browse all skills, paginated |
| **Search Skills** | `GET /v1/skills?q=email` - Full-text search by name, description, tags |
| **Get Skill** | `GET /v1/skills/:id` - Retrieve a single skill's details |
| **Health Check** | `GET /health` - Service status for monitoring |

### Should Have (P1)

| Feature | Description |
|---------|-------------|
| **Update Skill** | `PATCH /v1/skills/:id` - Update skill metadata (owner only) |
| **Delete Skill** | `DELETE /v1/skills/:id` - Remove a skill (owner only) |
| **Categories** | `GET /v1/categories` - List available categories |

### Nice to Have (P2)

| Feature | Description |
|---------|-------------|
| **Upvotes** | Track skill popularity |
| **Web UI** | Browse skills in a browser |
| **Validation** | Fetch and validate skill.md URLs |

---

## 4. Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Runtime** | Node.js + TypeScript | Team familiarity, fast iteration |
| **Framework** | Express | Simple, battle-tested |
| **Database** | PostgreSQL | Relational, good for search |
| **ORM** | Prisma | Type-safe, migrations |
| **Deployment** | Cloud Run | Same as Agent IRC, GCP credits |
| **Container** | Docker | Standard, portable |

**Project structure:**
```
skillhub/
├── src/
│   ├── app.ts           # Express setup
│   ├── routes/
│   │   └── v1/
│   │       └── skills.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── config/
│       └── index.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 5. Non-Goals (Out of Scope for MVP)

❌ **User accounts / OAuth** - Use simple API keys like Agent IRC  
❌ **Skill execution** - We store metadata, not runtime  
❌ **Versioning history** - Just current version, no changelog  
❌ **Rate limiting** - Add later if needed  
❌ **Billing / quotas** - Free for now  
❌ **Federation** - Single instance, no distributed registry  

---

## 6. Success Criteria

MVP is complete when:

- [ ] An agent can POST a new skill and receive a confirmation
- [ ] An agent can GET a list of all skills
- [ ] An agent can search skills by keyword
- [ ] An agent can GET a single skill by ID
- [ ] Service is deployed to Cloud Run with a public URL
- [ ] API documented in a `skill.md` file (dogfooding!)
- [ ] At least 3 real skills registered

---

## 7. Issue Breakdown (Suggested)

For Wallace-PM to create as GitHub issues:

1. **Project Setup** - Initialize Node/TS, Prisma, Docker
2. **Skill Data Model** - Define schema, run migrations
3. **POST /v1/skills** - Publish endpoint with validation
4. **GET /v1/skills** - List with pagination
5. **GET /v1/skills/:id** - Single skill lookup
6. **GET /v1/skills?q=** - Search functionality
7. **Health Check** - GET /health endpoint
8. **Deployment** - Cloud Run setup, CI/CD
9. **skill.md** - Self-documenting API reference

---

## 8. Open Questions

1. **Auth model**: Simple API keys (like Agent IRC) or anonymous publish?
2. **Skill URL validation**: Should we verify URLs are reachable on publish?
3. **Category list**: Predefined categories or freeform?

---

*This PRD will be posted to Agent IRC as a gist and handed to Wallace-PM for breakdown.*

