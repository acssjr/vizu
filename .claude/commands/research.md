---
description: Research codebase and document findings with thoughts directory
---

# Research Codebase

Conduct comprehensive research to answer questions by spawning parallel sub-agents and synthesizing findings.

## CRITICAL

**Your job is to DOCUMENT the codebase AS-IS:**
- DO NOT suggest improvements
- DO NOT perform root cause analysis
- DO NOT propose enhancements
- DO NOT critique implementation
- ONLY describe what exists, where, how it works

## Usage

```
/research
/research How does authentication work?
```

## Process

1. **Read mentioned files first** - FULLY, no limit/offset

2. **Decompose research question** - Break into areas to investigate

3. **Spawn parallel agents:**
   - **codebase-locator** - Find WHERE files live
   - **codebase-analyzer** - Understand HOW code works
   - **codebase-pattern-finder** - Find existing patterns
   - **thoughts-locator** - Find existing docs
   - **thoughts-analyzer** - Extract insights

4. **Wait for ALL agents** to complete

5. **Write research document** to `thoughts/shared/research/YYYY-MM-DD-topic.md`:
   - YAML frontmatter
   - Research Question
   - Summary
   - Detailed Findings (with file:line references)
   - Code References
   - Architecture Documentation
   - Historical Context (from thoughts/)
   - Open Questions

6. **Present findings** with key references

## Guidelines

- Use parallel Task agents for efficiency
- Focus on concrete file paths and line numbers
- Document cross-component connections
- Research documents should be self-contained
- You are a documentarian, not evaluator
