# nestjs-toolkit

A Claude Code plugin for NestJS + MongoDB development.

## What's included

### Skills (slash commands)
| Command | What it does |
|---------|-------------|
| `/nestjs-toolkit:nestjs-generate [name]` | Generate a complete NestJS module (schema, DTOs, service, controller) |
| `/nestjs-toolkit:nestjs-api-test` | Generate curl commands to test all API endpoints |

### Agents (subagents)
| Agent | What it does |
|-------|-------------|
| `nestjs-security` | Security audit: NoSQL injection, missing validation, data exposure |

### Hooks (automation)
| Trigger | What it does |
|---------|-------------|
| After editing `.ts` files | Auto type-check with `tsc --noEmit` |

### MCP servers
| Server | What it does |
|--------|-------------|
| `mongodb-plugin` | Query your MongoDB database directly from Claude |

## Install

```bash
# From a marketplace
/plugin install nestjs-toolkit@your-marketplace

# Or from a local directory
/plugin install ./path/to/nestjs-toolkit
```

## Usage

```
# Generate a new users module
/nestjs-toolkit:nestjs-generate users

# Test all endpoints
/nestjs-toolkit:nestjs-api-test

# Security review happens automatically when you edit auth code
# The hook auto-lints after every TypeScript edit
```
