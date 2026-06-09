---
name: api-test
description: >
  Generates curl commands to test all API endpoints. Use when the user
  wants to test the API, check endpoints, or needs example requests.
  Also useful after adding new endpoints.
allowed-tools: Read, Grep, Glob
---

## Generate API Test Commands

Scan all controller files to find every endpoint, then generate ready-to-run
curl commands for each one.

### Steps

1. Find all `*.controller.ts` files using Glob
2. For each controller, extract:
   - Route prefix from @Controller('...')
   - Each method: HTTP verb, path, expected body from the DTO
3. Generate curl commands with:
   - Base URL: `http://localhost:3000/api/v1`
   - Proper Content-Type headers for POST/PUT
   - Realistic sample data matching the DTO validation rules
   - Include query parameter examples for GET list endpoints

### Output format

Group by controller, with a brief comment above each command:

```bash
# === Tasks ===

# Create a task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "...", "priority": "high"}'

# List tasks (with filters)
curl "http://localhost:3000/api/v1/tasks?status=todo&page=1&limit=5"
```

### Tips
- Use `| jq .` at the end for pretty-printed JSON
- Include edge cases: missing required fields, invalid enums
- Add a "quick smoke test" section that hits every endpoint in sequence
