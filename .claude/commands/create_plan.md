---
description: Create detailed implementation plans through interactive research and iteration
---

# Create Implementation Plan

Create detailed implementation plans through an interactive, iterative process.

## Usage

```
/create_plan
/create_plan thoughts/tickets/eng_1234.md
/create_plan think deeply about thoughts/tickets/feature.md
```

## Process

1. **Gather context** - Read all mentioned files FULLY, spawn research agents

2. **Research & discovery** - Use parallel agents:
   - codebase-locator - Find relevant files
   - codebase-analyzer - Understand implementations
   - codebase-pattern-finder - Find similar patterns

3. **Present findings** with design options and open questions

4. **Develop structure** - Propose phases, get feedback

5. **Write plan** to `thoughts/shared/plans/YYYY-MM-DD-description.md`:
   - Overview, Current State, Desired End State
   - What We're NOT Doing (scope)
   - Implementation Phases with Success Criteria
   - Testing Strategy
   - References

6. **Review** - Iterate until approved

## Guidelines

- Be skeptical - question vague requirements
- Be interactive - get buy-in at each step
- Be thorough - include file paths and line numbers
- Be practical - incremental, testable changes
- No open questions in final plan

## Success Criteria Format

Split into:
- **Automated Verification:** `make test`, `npm run lint`, etc.
- **Manual Verification:** UI testing, performance, edge cases
