---
description: Analyze brownfield codebase and create initial continuity ledger
---

# Onboard - Project Discovery

Analyze a brownfield codebase and create an initial continuity ledger.

## When to Use

- First time working in an existing project
- After running `init-project.sh` in a new project

## Process

Spawn the onboard agent:

```
Task(subagent_type="onboard", prompt="Onboard me to this project")
```

The agent will:
1. Check if `thoughts/ledgers/` exists (if not, run `~/.claude/scripts/init-project.sh`)
2. Explore codebase using RepoPrompt or bash fallback
3. Detect tech stack
4. Ask about your goals
5. Create continuity ledger at `thoughts/ledgers/CONTINUITY_CLAUDE-<project>.md`

## Output

- Continuity ledger created
- Clear starting context
- Ready to begin work with full project awareness

## Notes

- For BROWNFIELD projects (existing code)
- For greenfield, use `/create_plan` instead
- Ledger can be updated anytime with `/continuity_ledger`
