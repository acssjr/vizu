---
description: Create or update continuity ledger for state preservation across clears
---

# Continuity Ledger

Maintain a ledger file that survives `/clear` for long-running sessions.

**Why clear instead of compact?** Each compaction is lossy. Clearing + loading the ledger gives you fresh context with full signal.

## When to Use

- Before running `/clear`
- Context usage approaching 70%+
- Multi-day implementations
- Complex refactors

## Process

1. **Check for existing ledger:** `ls thoughts/ledgers/CONTINUITY_CLAUDE-*.md`
2. **Create/update** at `thoughts/ledgers/CONTINUITY_CLAUDE-<session-name>.md`

## Template

```markdown
# Session: <name>
Updated: <ISO timestamp>

## Goal
<Success criteria - what does "done" look like?>

## Constraints
<Tech requirements, patterns to follow>

## Key Decisions
- Decision 1: Chose X over Y because...

## State
- Done: <completed items>
- Now: <current focus - ONE thing>
- Next: <queued items>

## Open Questions
- UNCONFIRMED: <things needing verification after clear>

## Working Set
- Branch: `feature/xyz`
- Key files: `src/auth/`
- Test cmd: `npm test`
```

## After Clear

Ledger loads automatically (SessionStart hook). Review UNCONFIRMED items and continue.

## Tips

- Keep it concise
- One "Now" item forces focus
- UNCONFIRMED prefix signals what to verify
- Update frequently
