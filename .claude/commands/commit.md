---
description: Create git commits with user approval and no Claude attribution
---

# Commit Changes

Create git commits for the changes made during this session.

## Process

1. **Review changes:** Run `git status` and `git diff` to understand modifications
2. **Plan commits:** Group related changes, draft clear commit messages (imperative mood)
3. **Present plan:** Show files and messages, ask for confirmation
4. **Execute:** Use `git add` with specific files, create commits, show result with `git log`
5. **Generate reasoning:** Run `bash .claude/scripts/generate-reasoning.sh <hash> "<message>"`

## Important

- **NEVER add co-author information or Claude attribution**
- Commits should be authored solely by the user
- No "Generated with Claude" messages
- No "Co-Authored-By" lines
- Write commit messages as if the user wrote them

## Remember

- Group related changes together
- Keep commits focused and atomic
- The user trusts your judgment
