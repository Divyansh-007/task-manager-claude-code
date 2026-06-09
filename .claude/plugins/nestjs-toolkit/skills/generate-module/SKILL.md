---
name: nestjs-generate
description: >
  Generates a complete NestJS feature module with Mongoose schema, DTOs,
  service, controller, and module file. Follows NestJS + Mongoose best
  practices. Invoked via /nestjs-toolkit:nestjs-generate
argument-hint: "[module-name]"
arguments: name
allowed-tools: Read, Write, Edit, Bash(mkdir*)
---

## Generate NestJS Module: $name

Create `src/$name/` with the full module structure:

### 1. Schema (`schemas/$name.schema.ts`)
- @Schema({ timestamps: true })
- Relevant @Prop fields for the entity
- Export class + Document type + SchemaFactory
- Indexes for common query fields

### 2. Create DTO (`dto/create-$name.dto.ts`)
- class-validator on every field
- @ApiProperty with examples
- @MaxLength on strings

### 3. Update DTO (`dto/update-$name.dto.ts`)
- PartialType(CreateDto)

### 4. Query DTO (`dto/query-$name.dto.ts`)
- page, limit, sort (pagination)
- Filter fields matching schema

### 5. Service (`$name.service.ts`)
- CRUD: create, findAll (paginated), findOne, update, remove
- NotFoundException for missing records
- .exec() on all queries

### 6. Controller (`$name.controller.ts`)
- RESTful routes, proper HTTP status codes
- Full Swagger: @ApiTags, @ApiOperation, @ApiResponse, @ApiParam

### 7. Module (`$name.module.ts`)
- MongooseModule.forFeature
- Export the service

After generating, register in `src/app.module.ts` and run `npm run lint`.
