---
name: add-endpoint
description: >
  Adds a new API endpoint to an existing module. Handles controller method,
  service method, DTO updates, and Swagger docs. Use when the user asks to
  add a new endpoint, route, or API operation.
argument-hint: "[method] [path] in [module]"
arguments: spec
---

## Add New Endpoint: $spec

### Steps

1. **Parse the request**: Identify HTTP method, path, module, and what it does
2. **Read existing files** in the target module:
   - Controller (to see existing patterns)
   - Service (to see data access patterns)
   - Schema (to understand the data model)
   - DTOs (to see validation patterns)
3. **Create/update DTO** if the endpoint needs request body validation
4. **Add service method** with proper Mongoose operations
5. **Add controller method** with:
   - Correct HTTP decorator (@Get, @Post, @Put, @Delete, @Patch)
   - @ApiOperation with summary
   - @ApiResponse for success and error cases
   - @ApiParam for path parameters
   - Proper HttpStatus code
6. **Verify**: Run `npm run lint` to check for type errors

### Conventions (from this project)
- Services throw NotFoundException for missing resources
- List endpoints support pagination (page, limit, sort)
- All responses go through TransformInterceptor
- Use existing enums — don't create inline string unions
