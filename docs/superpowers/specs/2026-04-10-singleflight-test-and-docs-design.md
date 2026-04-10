# SingleFlight Test & Docs Design

## Summary

Keep `src/index.ts` unchanged. Add comprehensive tests and fix the README usage example.

## Scope

- **No source code changes** — the 15-line `SingleFlight<T>` class is correct as-is.
- **Add tests** — cover core deduplication behavior in `__tests__/index.spec.ts`.
- **Fix README** — replace the incorrect usage example with a valid one.

## Test Cases

| # | Scenario | Verification |
|---|----------|-------------|
| 1 | Basic dedup | Same key called concurrently, factory executes once, all callers get same result |
| 2 | Key isolation | key-a and key-b called concurrently, each factory executes once |
| 3.1 | Re-entry after resolve | After promise resolves, calling `run` with same key re-executes factory |
| 3.2 | Re-entry after reject | After promise rejects, calling `run` with same key re-executes factory |
| 4 | Error propagation | Factory throws, all callers waiting on same key receive same rejection |
| 5 | Map cleanup | After promise settles, key is removed from internal Map |

## README Fix

Replace the incorrect example (`SingleFlight(1024)`) with:

```typescript
import SingleFlight from '@jswork/singleflight';

const sf = new SingleFlight<string>();

// Concurrent dedup: same key executes only once
const result = await sf.run('user:1', () => fetchUser('1'));
```
