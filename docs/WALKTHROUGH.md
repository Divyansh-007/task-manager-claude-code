# Hands-On Walkthrough: Claude Code Building Blocks
## Task Manager API (NestJS + MongoDB)

> Open this project in Claude Code and follow along.
> Each section includes what to try and what to observe.

---

## STEP 0 — Get Running

```bash
cd task-manager
npm install
# Start MongoDB first, then:
npm run start:dev
# Visit http://localhost:3000/api/docs for Swagger UI
```

---

## STEP 1 — Rules (CLAUDE.md + .claude/rules/)

### What's here

```
CLAUDE.md                          ← Project-level rules (loaded every session)
.claude/rules/
├── controller-rules.md            ← Only activates for *.controller.ts
├── dto-rules.md                   ← Only activates for dto/**/*.ts
├── schema-rules.md                ← Only activates for schemas/**/*.ts
├── service-rules.md               ← Only activates for *.service.ts
└── test-rules.md                  ← Only activates for *.spec.ts
```

### Try it in Claude Code

```
# Open Claude Code in the project
cd task-manager
claude

# Ask Claude something — it already knows your project:
> What build commands does this project use?
> What's the project structure?

# Claude answers from CLAUDE.md without reading files!

# Now ask Claude to edit a controller:
> Add a PATCH endpoint to tasks controller for updating status only

# Observe: Claude follows the controller-rules.md automatically
# (adds @ApiOperation, @ApiResponse, delegates to service, etc.)
# because the path-scoped rule activated for *.controller.ts

# Try editing a DTO:
> Add a "category" field to CreateTaskDto

# Observe: Claude adds class-validator + @ApiProperty automatically
# because dto-rules.md activated for dto/**/*.ts
```

### Key concept

CLAUDE.md = always loaded, global project knowledge
.claude/rules/*.md = loaded conditionally based on `paths:` globs

### Experiment

1. Edit `CLAUDE.md` and add: `- IMPORTANT: Always add JSDoc comments to service methods`
2. Ask Claude to add a new service method
3. Watch it add JSDoc comments on the new method
4. Remove the rule — the behavior stops

---

## STEP 2 — Commands & Skills (.claude/skills/)

### What's here

```
.claude/skills/
├── generate-module/SKILL.md       ← /generate-module [name]
├── api-test/SKILL.md              ← /api-test
├── code-review/SKILL.md           ← /code-review (runs in subagent)
└── add-endpoint/SKILL.md          ← /add-endpoint [spec]
```

### Try it in Claude Code

```
# Type / to see all available commands (built-in + your skills):
> /

# Generate a complete new module:
> /generate-module users

# Observe: Claude reads the existing tasks module for patterns,
# then generates all 7 files (schema, DTOs, service, controller, module)
# following your project's conventions

# Generate API test commands:
> /api-test

# Observe: Claude scans ALL controllers and generates curl commands

# Run a code review:
> /code-review

# Observe: This runs in a SUBAGENT (context: fork in frontmatter)
# so the review work doesn't clutter your main conversation

# Add a specific endpoint:
> /add-endpoint GET /tasks/overdue in tasks

# Observe: Claude reads the skill instructions, then adds the
# endpoint with proper Swagger docs, service method, etc.
```

### Key concepts

- Skills load ON DEMAND (not every session like CLAUDE.md)
- `description:` in frontmatter controls auto-detection
- `context: fork` runs the skill in an isolated subagent
- `disable-model-invocation: true` = manual /name only
- `allowed-tools:` restricts what Claude can do inside the skill

### Experiment

1. Create a new skill: `mkdir -p .claude/skills/seed-db`
2. Create `.claude/skills/seed-db/SKILL.md`:

```yaml
---
name: seed-db
description: Seeds the MongoDB database with sample task data for testing
allowed-tools: Read, Bash(node*), Bash(npx*)
---

Generate a Node.js script that connects to MongoDB and inserts 20 sample
tasks with varied statuses, priorities, assignees, and tags.

Use the Mongoose models from this project. Save as scripts/seed.js
and run it. Use realistic task titles related to software development.
```

3. Type `/seed-db` in Claude Code and watch it work

---

## STEP 3 — Agents (.claude/agents/)

### What's here

```
.claude/agents/
├── security-reviewer.md           ← Sonnet, read-only, security focus
├── test-writer.md                 ← Sonnet, can write files + run tests
└── doc-writer.md                  ← Haiku (fast + cheap), documentation
```

### Try it in Claude Code

```
# View all agents:
> /agents

# Trigger the security reviewer:
> Review this codebase for security vulnerabilities

# Observe: Claude delegates to security-reviewer (you'll see it
# spawn with its own context). It uses only Read/Grep/Glob
# (as restricted in the frontmatter). Returns a severity report.

# Trigger the test writer:
> Write unit tests for the tasks service

# Observe: test-writer spawns, reads the service + schema,
# generates a .spec.ts file, runs npm test to verify.
# Your main conversation stays clean.

# Trigger the doc writer:
> Generate API documentation for this project

# Observe: doc-writer uses Haiku (faster, cheaper than Sonnet)
# because documentation doesn't need complex reasoning.
```

### Key concepts

- Agents get their OWN context window (isolated from your main chat)
- They return only the summary — keeping your context clean
- `tools:` restricts what they can do (read-only for reviewers!)
- `model:` picks the right model (haiku for simple tasks = cheaper)
- Claude auto-delegates based on the agent's `description:`

### Experiment

1. Ask Claude: "How does the tasks service handle pagination?"
   - Observe: Claude may delegate to the built-in Explore agent (Haiku)
     for a quick read-only codebase scan

2. Modify `security-reviewer.md` — add a new checklist item:
   ```
   - [ ] Rate limiting on all POST endpoints
   ```
3. Ask for another security review — the new check appears

---

## STEP 4 — MCP (.mcp.json)

### What's here

```
.mcp.json                          ← Project MCP server definitions
docs/mcp-setup.md                  ← Setup guide with examples
```

### Try it in Claude Code

```
# Check MCP status:
> /mcp

# If MongoDB is running, Claude can query it directly:
> How many tasks are in the database?
> Show me all tasks with priority "urgent"
> What indexes exist on the tasks collection?

# Add GitHub (replace with your token):
claude mcp add --env GITHUB_TOKEN=ghp_xxx github -- \
  npx -y @modelcontextprotocol/server-github

# Now Claude can:
> Create a PR with my current changes
> List open issues in this repo
> What PRs need review?
```

### Key concepts

- MCP = external tools (databases, APIs, services)
- Skills = instructions. MCP = capabilities.
- `--scope local` (just you) vs `--scope project` (team via .mcp.json)
- Tool search loads MCP tools on demand (saves context tokens)

### Experiment

1. Start MongoDB and try asking Claude to query it
2. Add the GitHub MCP server with your token
3. Try: "Create a GitHub issue for adding user authentication"
4. Check `/mcp` to see server status

---

## STEP 5 — Plugin (.claude/plugins/nestjs-toolkit/)

### What's here

```
.claude/plugins/nestjs-toolkit/
├── plugin.json                    ← Plugin metadata
├── README.md                      ← What the plugin provides
├── skills/                        ← Bundled skills
│   ├── generate-module/SKILL.md
│   └── api-test/SKILL.md
├── agents/                        ← Bundled agent
│   └── nestjs-security.md
├── hooks/                         ← Automation hooks
│   └── post-edit-lint.json        ← Auto type-check after .ts edits
└── .mcp.json                      ← Bundled MCP servers
```

### Try it in Claude Code

```
# View plugin info:
> /plugin

# Plugin skills have namespaced commands:
> /nestjs-toolkit:nestjs-generate comments

# The hook fires automatically after any .ts edit:
# Edit any TypeScript file, and tsc --noEmit runs automatically.
# If there's a type error, Claude sees it immediately.

# The plugin agent works alongside your project agents:
> /agents
# You'll see nestjs-security listed from the plugin
```

### Key concepts

- A plugin BUNDLES skills + agents + hooks + MCP into one unit
- Install with: `/plugin install nestjs-toolkit@marketplace`
- Plugin commands are namespaced: `plugin-name:skill-name`
- Plugin agents CANNOT use hooks/mcpServers/permissionMode (security)
- Hooks run deterministically (not "maybe" like LLM instructions)

### Experiment: Publish your own plugin

1. Create a GitHub repo: `your-username/claude-plugins`
2. Copy the `nestjs-toolkit/` directory into it
3. In Claude Code:
   ```
   /plugin marketplace add your-username/claude-plugins
   ```
4. Now anyone can install:
   ```
   /plugin install nestjs-toolkit@your-username/claude-plugins
   ```

---

## How It All Connects

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR SESSION                          │
│                                                         │
│  CLAUDE.md loads → Claude knows your project             │
│  .claude/rules/ activate → per-file conventions          │
│                                                         │
│  You type /generate-module users                         │
│  → SKILL loads on demand                                │
│  → Skill creates 7 files following your conventions      │
│  → Hook fires: tsc --noEmit (auto type-check)            │
│                                                         │
│  You type "review for security"                          │
│  → Claude delegates to security-reviewer AGENT           │
│  → Agent works in its own context (Sonnet, read-only)    │
│  → Returns severity report to your main chat             │
│                                                         │
│  You type "how many urgent tasks in the database?"       │
│  → Claude calls MongoDB MCP server                       │
│  → Gets real data, responds naturally                    │
│                                                         │
│  All of this ships as one PLUGIN for your team            │
└─────────────────────────────────────────────────────────┘
```

---

## Cheat Sheet

| Want to... | Use |
|------------|-----|
| Set permanent project conventions | `CLAUDE.md` |
| Set file-specific rules | `.claude/rules/*.md` with `paths:` |
| Create a reusable workflow | `.claude/skills/name/SKILL.md` |
| Isolate side-work (review, research) | `.claude/agents/name.md` |
| Connect to external service | `claude mcp add ...` or `.mcp.json` |
| Bundle & share all of the above | `.claude/plugins/name/plugin.json` |

## Official Docs

- Skills: https://docs.anthropic.com/en/docs/claude-code/slash-commands
- Agents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- MCP: https://docs.anthropic.com/en/docs/claude-code/mcp
- Memory: https://docs.anthropic.com/en/docs/claude-code/memory
- Hooks: https://docs.anthropic.com/en/docs/claude-code/hooks-guide
- Plugins: https://docs.anthropic.com/en/docs/claude-code/settings
