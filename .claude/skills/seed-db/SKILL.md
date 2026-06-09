---
name: seed-db
description: Seeds the MongoDB database with sample task data for testing
allowed-tools: Read, Bash(node*), Bash(npx*)
---

Generate a Node.js script that connects to MongoDB and inserts 20 sample
tasks with varied statuses, priorities, assignees, and tags.

Use the Mongoose models from this project. Save as scripts/seed.js
and run it. Use realistic task titles related to software development.