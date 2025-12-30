---
description: Debug issues by investigating logs, database state, and git history
---

# Debug

Investigate problems during manual testing or implementation without editing files.

## Usage

```
/debug
/debug thoughts/shared/plans/feature.md
```

## Process

1. **Understand the problem:**
   - What were you trying to test/implement?
   - What went wrong?
   - Any error messages?

2. **Investigate** (parallel tasks):
   - **Logs:** Find and analyze recent logs for errors
   - **Database:** Check state, schema, anomalies (if applicable)
   - **Git/Files:** Check status, recent commits, uncommitted changes

3. **Present debug report:**

```markdown
## Debug Report

### What's Wrong
[Clear statement based on evidence]

### Evidence Found
**From Logs:** [Errors with timestamps]
**From Database:** [Query results]
**From Git/Files:** [Recent changes]

### Root Cause
[Most likely explanation]

### Next Steps
1. **Try This First:** [Command]
2. **If That Doesn't Work:** [Alternative]
```

## Quick Reference

```bash
# Find latest logs
ls -t ./logs/*.log | head -1

# Database queries (SQLite)
sqlite3 {db} ".tables"
sqlite3 {db} "SELECT * FROM {table} ORDER BY created_at DESC LIMIT 5;"

# Service check
ps aux | grep {service}
lsof -i :{port}

# Git state
git status
git log --oneline -10
git diff
```

## Note

This is investigation only - no file editing. Perfect for debugging during manual testing.
