---
name: code-review
description: >
  Reviews NestJS code for quality, security, and best practices. Use when
  the user asks to review code, check for issues, or audit the codebase.
context: fork
allowed-tools: Read, Grep, Glob
---

## NestJS Code Review

Review the codebase against this checklist. Read all source files first,
then report findings grouped by severity.

### Checklist

**Security**
- [ ] No secrets or API keys in source code
- [ ] Input validation on all endpoints (class-validator)
- [ ] No raw MongoDB queries (injection risk)
- [ ] Proper error handling — no stack traces leaked to clients
- [ ] CORS configured appropriately
- [ ] Rate limiting in place (or flagged as missing)

**Architecture**
- [ ] One module per feature domain
- [ ] Services contain business logic, controllers are thin
- [ ] No circular dependencies between modules
- [ ] Proper dependency injection (no manual instantiation)
- [ ] Schemas define indexes for query patterns

**Code Quality**
- [ ] All DTO fields have validation decorators
- [ ] All controller methods have Swagger decorators
- [ ] Consistent error handling (NotFoundException, etc.)
- [ ] No console.log — use NestJS Logger
- [ ] Consistent naming: files, classes, methods

**Performance**
- [ ] Pagination on list endpoints
- [ ] MongoDB indexes match query patterns
- [ ] No N+1 queries in service methods
- [ ] Promise.all for parallel independent operations

**Testing**
- [ ] Unit tests exist for services
- [ ] Edge cases covered (not found, validation errors)
- [ ] No hardcoded test data that could rot

### Output format

```
## 🔴 Critical (must fix)
1. [Security] .env committed to repo — add to .gitignore

## 🟡 Warning (should fix)
1. [Performance] No index on tasks.assignee — add compound index

## 🟢 Suggestion (nice to have)
1. [Quality] Add request logging interceptor

## ✅ What's good
- Clean module separation
- Consistent DTO validation
```
