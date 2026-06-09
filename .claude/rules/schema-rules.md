---
paths: ["src/**/schemas/**/*.ts"]
---
# Schema rules

- Always add { timestamps: true } to @Schema() for createdAt/updatedAt
- Define indexes at the bottom of the file for common query patterns
- Use TypeScript enums for status/type fields, not raw strings
- Export both the class (Task) and the document type (TaskDocument)
- Use @Prop({ trim: true }) for all string fields to avoid whitespace issues
