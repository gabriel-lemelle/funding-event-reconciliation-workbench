# Test coverage

## Automated gate

- `npm test`: six zero-runtime-dependency source-contract tests for CSP/keyless boundaries, unique IDs, JavaScript-to-DOM selector integrity, canonical approval logic, empty state, and non-color filter state.
- `node --check app.js`: JavaScript syntax.
- `npm audit --omit=dev`: confirms there are no production dependencies or advisories.
- `npm run eval`: optional paid Promptfoo guardrail suite for a future live-model triage contract.

## Browser gate

Before release, verify desktop, 390px, and 320px layouts; 8-row load; collapsed/open Product thinking; search success and empty state; all filters; R01 inclusion in Needs approval; case focus transfer; copy status; strict CSP; and an empty console.

## Merge policy

The three free automated checks must pass. The document must not overflow horizontally at 320 CSS pixels, and empty results must not leave stale detail visible.
