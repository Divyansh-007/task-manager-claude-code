---
name: nestjs-api-test
description: >
  Scans controllers and generates ready-to-run curl commands for every
  endpoint. Includes success cases, validation errors, and a smoke test
  sequence. Invoked via /nestjs-toolkit:nestjs-api-test
allowed-tools: Read, Grep, Glob
---

## Generate API Test Commands

1. Glob for all `*.controller.ts` files
2. Extract route prefix from @Controller('...')
3. For each method: HTTP verb, path, body shape from DTO

### Output grouped by controller:

```bash
# === [Resource] ===

# Create
curl -X POST http://localhost:3000/api/v1/[resource] \
  -H "Content-Type: application/json" \
  -d '{ ... }' | jq .

# List (with filters + pagination)
curl "http://localhost:3000/api/v1/[resource]?page=1&limit=5" | jq .

# Get by ID
curl http://localhost:3000/api/v1/[resource]/REPLACE_ID | jq .

# Update
curl -X PUT http://localhost:3000/api/v1/[resource]/REPLACE_ID \
  -H "Content-Type: application/json" \
  -d '{ ... }' | jq .

# Delete
curl -X DELETE http://localhost:3000/api/v1/[resource]/REPLACE_ID
```

End with a **smoke test script** that creates → reads → updates → deletes.
