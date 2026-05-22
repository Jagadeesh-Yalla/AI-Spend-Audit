# Tests

All tests are in `__tests__/auditEngine.test.ts` and cover the core audit engine logic.

## How to run

```bash
npm test
```

## Test list

| # | File | What it covers |
|---|---|---|
| 1 | auditEngine.test.ts | Cursor Business with 2 seats recommends downgrade to Pro |
| 2 | auditEngine.test.ts | Cursor Pro with 1 seat returns optimal (0 savings) |
| 3 | auditEngine.test.ts | Claude Max for 1 user recommends Pro — saves $80/mo ($960/yr) |
| 4 | auditEngine.test.ts | isHighSavings flag is true when savings exceed $500/mo |
| 5 | auditEngine.test.ts | Empty tools array returns zero savings and empty recommendations |
| 6 | auditEngine.test.ts | GitHub Copilot Enterprise with 3 seats recommends Business |
| 7 | auditEngine.test.ts | Annual savings is exactly 12× monthly savings |

## Design decisions

- Tests cover only the audit engine (pure functions) — not the API routes or UI
- No mocking needed since auditEngine has zero external dependencies
- All tests use realistic input values matching actual pricing data 
