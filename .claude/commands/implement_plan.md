---
description: Implement technical plans from thoughts/shared/plans with verification
---

# Implement Plan

Implement an approved technical plan from `thoughts/shared/plans/`.

## Usage

```
/implement_plan thoughts/shared/plans/YYYY-MM-DD-feature.md
```

## Execution Modes

### Mode 1: Direct Implementation (Default)
For small plans (3 or fewer tasks):
- Implement each phase yourself
- Context accumulates in main conversation

### Mode 2: Agent Orchestration (Recommended for larger plans)
For 4+ tasks or when context preservation is critical:
- Act as thin orchestrator
- Agents execute each task and create handoffs
- Compaction-resistant

Say: "I'll use agent orchestration for this plan"

## Process

1. **Read plan completely** - Check for existing checkmarks
2. **Read original ticket and all mentioned files**
3. **Create todo list** to track progress
4. **Implement each phase:**
   - Make changes
   - Run success criteria checks
   - Fix issues before proceeding
   - Update checkboxes in plan
   - **Pause for manual verification** after each phase

## Verification Format

```
Phase [N] Complete - Ready for Manual Verification

Automated verification passed:
- [List automated checks]

Please perform manual verification:
- [List manual steps from plan]

Let me know when complete so I can proceed to Phase [N+1].
```

## Agent Orchestration

For each task, spawn:
```
Task(subagent_type="general-purpose", model="opus", prompt="[implement_task skill + context]")
```

Handoffs persist on disk. If compaction happens, re-read handoffs and continue.
