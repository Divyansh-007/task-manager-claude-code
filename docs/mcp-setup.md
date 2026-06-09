# MCP Setup Guide for Task Manager

## What is MCP?
MCP (Model Context Protocol) connects Claude Code to external tools.
Think of it as giving Claude new superpowers — querying your database,
creating GitHub PRs, reading Notion docs, etc.

## Quick Setup

### 1. MongoDB MCP (query your database from Claude)
```bash
# No config needed if MongoDB is running locally
# Claude can now: browse collections, run queries, check indexes

# Try asking Claude:
# "Show me all tasks with priority=urgent"
# "What indexes exist on the tasks collection?"
# "How many tasks were created this week?"
```

### 2. GitHub MCP (manage your repo from Claude)
```bash
# Add with your token
claude mcp add --env GITHUB_TOKEN=ghp_your_token github -- \
  npx -y @modelcontextprotocol/server-github

# Try asking Claude:
# "Create a PR for the changes I just made"
# "List open issues labeled 'bug'"
# "What PRs are waiting for review?"
```

### 3. Notion MCP (connect your project docs)
```bash
# Add Notion (remote HTTP server)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Try asking Claude:
# "Find the API spec document in Notion"
# "Create a page documenting the tasks API"
```

## Scoping

```bash
# Only you, only this project (default)
claude mcp add --scope local ...

# Shared with team via .mcp.json in git
claude mcp add --scope project ...

# Available in all your projects
claude mcp add --scope user ...
```

## Management Commands

```bash
claude mcp list          # see all configured servers
claude mcp get mongodb   # check specific server
claude mcp remove github # remove a server
/mcp                     # check status in-session
```

## Adding Remote HTTP Servers

Most modern MCP servers use HTTP transport:
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
claude mcp add --transport http slack https://mcp.slack.com/mcp
claude mcp add --transport http linear https://mcp.linear.app/mcp
```
