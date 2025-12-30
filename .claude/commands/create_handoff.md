---
description: Create handoff document for transferring work to another session
---

# Create Handoff

Create a thorough but concise handoff document to transfer work to another session.

## Process

1. **Determine filepath:** Get session name from ledger, create file at `thoughts/shared/handoffs/{session}/YYYY-MM-DD_HH-MM-SS_description.md`

2. **Get Braintrust IDs:** Read `~/.claude/state/braintrust_sessions/*.json` for trace correlation

3. **Write handoff** with:
   - YAML frontmatter (date, session, git info, trace IDs)
   - Task(s) and status
   - Critical References
   - Recent changes (file:line format)
   - Learnings
   - Post-Mortem (What Worked, What Failed, Key Decisions)
   - Artifacts
   - Action Items & Next Steps

4. **Mark outcome:** Ask user about session outcome (SUCCEEDED, PARTIAL_PLUS, PARTIAL_MINUS, FAILED)

5. **Confirm:** Show handoff path and how to resume

## Resume Later

```
/resume_handoff path/to/handoff.md
```

## Guidelines

- More information, not less
- Be thorough and precise
- Avoid excessive code snippets - use `file:line` references
