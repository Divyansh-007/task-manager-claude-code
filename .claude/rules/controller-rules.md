---
paths: ["src/**/*.controller.ts"]
---
# Controller rules

- Every controller method MUST have @ApiOperation and @ApiResponse decorators
- Use appropriate HTTP status codes: 201 for POST, 204 for DELETE
- Controllers must NOT contain business logic — delegate to services
- Always validate path params with @Param and query params with @Query
- Group related endpoints with @ApiTags matching the module name
