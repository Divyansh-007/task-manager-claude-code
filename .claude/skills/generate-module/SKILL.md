---
name: generate-module
description: >
  Generates a complete NestJS feature module with Mongoose schema, DTOs,
  service, controller, and module file. Use when the user asks to create
  a new resource, entity, or feature module.
argument-hint: "[module-name]"
arguments: name
allowed-tools: Read, Write, Edit, Bash(mkdir*)
---

## Generate NestJS Module: $name

Create a complete feature module at `src/$name/` following this project's patterns.

### Files to generate

1. **`src/$name/schemas/$name.schema.ts`**
   - Mongoose schema with @Schema({ timestamps: true })
   - Relevant @Prop fields based on the entity name
   - Export: class, Document type, SchemaFactory
   - Add indexes for common query fields

2. **`src/$name/dto/create-$name.dto.ts`**
   - class-validator decorators on every field
   - @ApiProperty / @ApiPropertyOptional with examples
   - @MaxLength on strings

3. **`src/$name/dto/update-$name.dto.ts`**
   - PartialType(CreateDto)

4. **`src/$name/dto/query-$name.dto.ts`**
   - Pagination: page, limit, sort
   - Filter fields matching schema

5. **`src/$name/$name.service.ts`**
   - CRUD: create, findAll (paginated), findOne, update, remove
   - NotFoundException for missing records
   - .exec() on all queries

6. **`src/$name/$name.controller.ts`**
   - RESTful endpoints with proper HTTP methods/status codes
   - Full Swagger decorators
   - @ApiTags('$name')

7. **`src/$name/$name.module.ts`**
   - Import MongooseModule.forFeature
   - Export the service

### After generating

- Register the new module in `src/app.module.ts` imports
- Verify with: `npm run lint`

### Reference

Follow the exact patterns from the existing tasks module. Read these files first:
- src/tasks/tasks.module.ts
- src/tasks/tasks.controller.ts
- src/tasks/tasks.service.ts
- src/tasks/schemas/task.schema.ts
- src/tasks/dto/create-task.dto.ts
