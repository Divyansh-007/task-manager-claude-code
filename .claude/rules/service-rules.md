---
paths: ["src/**/*.service.ts"]
---
# Service rules

- Always throw NotFoundException for missing records — never return null
- Use Promise.all for independent parallel queries (e.g., data + count)
- Always call .exec() on Mongoose queries for proper promise behavior
- findByIdAndUpdate must use { new: true, runValidators: true }
- Aggregation pipelines go in dedicated methods, not inline in other methods
