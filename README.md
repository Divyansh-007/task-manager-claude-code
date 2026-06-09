# Task Manager API

A NestJS + MongoDB REST API for task management — built as a **Claude Code learning project** to demonstrate all six building blocks: Rules, Commands, Skills, Agents, MCP, and Plugins.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start MongoDB (ensure it's running on localhost:27017)

# Run in development mode
npm run start:dev

# API:    http://localhost:3000/api/v1/tasks
# Docs:   http://localhost:3000/api/docs
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/tasks` | Create a task |
| GET | `/api/v1/tasks` | List tasks (filterable, paginated) |
| GET | `/api/v1/tasks/stats` | Task statistics |
| GET | `/api/v1/tasks/:id` | Get task by ID |
| PUT | `/api/v1/tasks/:id` | Update a task |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

## Claude Code Building Blocks

This project includes working examples of all six Claude Code customization layers:

### 1. Rules (`CLAUDE.md` + `.claude/rules/`)
Project conventions loaded every session. Path-scoped rules activate only for matching files.

### 2. Commands & Skills (`.claude/skills/`)
- `/generate-module [name]` — scaffold a full NestJS module
- `/api-test` — generate curl commands for all endpoints
- `/code-review` — NestJS-specific code review
- `/add-endpoint [spec]` — add a new endpoint to existing module

### 3. Agents (`.claude/agents/`)
- `security-reviewer` — audits code for vulnerabilities
- `test-writer` — generates unit tests
- `doc-writer` — generates API documentation

### 4. MCP (`.mcp.json`)
- MongoDB server — query database from Claude
- GitHub server — manage PRs and issues
- Filesystem server — enhanced file operations

### 5. Plugin (`.claude/plugins/nestjs-toolkit/`)
Bundles skills + agents + hooks + MCP into one installable package.

## Scripts

```bash
npm run build       # Compile TypeScript
npm run start       # Run compiled JS
npm run start:dev   # Run with ts-node (development)
npm run lint        # Type-check without emitting
npm test            # Run Jest tests
```
