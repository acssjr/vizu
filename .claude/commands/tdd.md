---
description: Test-driven development workflow - write failing test first
---

# Test-Driven Development (TDD)

Write the test first. Watch it fail. Write minimal code to pass.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? **Delete it. Start over.**

## Red-Green-Refactor

### RED - Write Failing Test

```typescript
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };
  const result = await retryOperation(operation);
  expect(result).toBe('success');
  expect(attempts).toBe(3);
});
```

### Verify RED - Watch It Fail (MANDATORY)

```bash
npm test path/to/test.test.ts
```

Confirm: Test fails (not errors), for expected reason.

### GREEN - Minimal Code

Write simplest code to pass. Don't add features.

### Verify GREEN (MANDATORY)

```bash
npm test
```

All tests pass, output pristine.

### REFACTOR

After green: remove duplication, improve names, extract helpers.
Keep tests green. Don't add behavior.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Already manually tested" | Can't re-run. No record. |
| "Keep as reference" | You'll adapt it. That's testing after. Delete. |

## Red Flags - STOP and Start Over

- Code before test
- Test passes immediately
- Can't explain why test failed
- "Just this once"
- "I already manually tested it"

## Verification Checklist

- [ ] Every new function has a test
- [ ] Watched each test fail before implementing
- [ ] Wrote minimal code to pass
- [ ] All tests pass
- [ ] Edge cases covered
