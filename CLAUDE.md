# Task Manager API

## Quick Commands
- `npm run build` — compile TypeScript
- `npm run start:dev` — run dev server (ts-node)
- `npm run start` — run compiled JS
- `npm run lint` — type-check without emitting
- `npm test` — run jest tests

## Architecture
- **Framework**: NestJS 10 + Mongoose + MongoDB
- **Pattern**: Module → Controller → Service → Schema
- **API prefix**: `/api/v1`
- **Docs**: Swagger at `/api/docs`

## Project Structure
```
src/
├── main.ts                         # Bootstrap + global pipes/filters
├── app.module.ts                   # Root module, MongoDB connection
├── tasks/                          # Task feature module
│   ├── tasks.module.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── dto/                        # Validation DTOs
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   └── query-task.dto.ts
│   └── schemas/
│       └── task.schema.ts          # Mongoose schema + enums
└── common/
    ├── filters/                    # Global exception filter
    └── interceptors/               # Response transform
```

## Conventions
- All responses wrapped in `{ success: true, data: ... }`
- Errors wrapped in `{ success: false, statusCode, error: ... }`
- Use class-validator decorators on every DTO field
- Use Swagger decorators on every controller method and DTO
- IMPORTANT: Never use raw MongoDB queries — always use Mongoose model methods
- IMPORTANT: Never commit .env files

## Coding Standards
- No default exports — always use named exports
- One class per file
- Services handle business logic, controllers handle HTTP
- Use constructor injection for all dependencies
- Enum values use snake_case (e.g., `in_progress`)

## Git Workflow
- Commit format: `feat|fix|chore|docs(scope): description`
- Example: `feat(tasks): add bulk delete endpoint`
