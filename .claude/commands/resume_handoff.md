---
description: Resume work from handoff document with context analysis and validation
---

# Resume Handoff

Resume work from a handoff document through an interactive process.

## Usage

```
/resume_handoff thoughts/shared/handoffs/session/handoff.md
/resume_handoff ENG-XXXX  (finds most recent for ticket)
/resume_handoff           (lists available handoffs)
```

## Process

1. **Read handoff completely** - Extract tasks, changes, learnings, artifacts, next steps

2. **Spawn research tasks** - Verify current state:
   - Read all artifacts mentioned
   - Check files from learnings and recent changes
   - Verify modifications still exist

3. **Present analysis:**
   - Original tasks and current status
   - Key learnings validated
   - Recent changes status
   - Recommended next actions
   - Potential issues

4. **Create action plan** - Use TodoWrite to track tasks

5. **Begin implementation** - Apply patterns from handoff

## Guidelines

- Read entire handoff first
- Verify ALL mentioned changes still exist
- Get buy-in before starting work
- Never assume handoff state matches current state
- Consider creating a new handoff when done
