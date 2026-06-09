---
paths: ["src/**/*.spec.ts", "test/**/*.ts"]
---
# Test rules

- Use describe blocks grouped by method name: describe('create()', () => ...)
- Mock the Mongoose model — never connect to a real database in unit tests
- Test both success and error paths (especially NotFoundException)
- Use factories or builders for test data — never hardcode ObjectIds inline
- Each test should be independent — no shared mutable state between tests
