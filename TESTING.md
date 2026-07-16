# Testing

This is a static site with no runtime dependencies. The test strategy combines built-in Node
source-contract tests, a browser critical-path checklist, and a pinned **promptfoo** suite for
the simulated AI feature.

Run the local checks with `npm test` and `node --check app.js`.

## How to run the smoke checklist

Serve the page (`python -m http.server 4178`) and walk the paths below. The dated browser
record below is a manual verification snapshot; it is not a substitute for a committed
Playwright or screen-reader suite.

## Critical paths

| # | Path | Expected |
|---|---|---|
| 1 | Page loads | Title and `<h1>` read "Funding Event Reconciliation Workbench"; no console errors; CSP active. |
| 2 | Product thinking | The collapsed disclosure opens to persona hypotheses, 4 ranked pains, JTBD, riskiest assumption, and 4 OST opportunities. |
| 3 | Metric strip | Median MTTR, human-gated action count, event-backfill MTTR, and synthetic-exception count populate. |
| 4 | Metric tree | 4 per-class MTTR cards render with current vs target bars; over-target classes are visually distinct (fill + "Over target" text). |
| 5 | Queue select | Clicking an incident updates the case panel and **moves focus to the case heading**. |
| 6 | Filters | Each filter narrows the queue; the active filter shows `aria-pressed="true"` + a visible checkmark; "All" restores. |
| 7 | Search | Typing (e.g. `R10`, `Plaid`) filters rows; no match hides stale detail and announces the empty state. |
| 8 | Guardrail posture | Regulated cases (R10/R07/R11) show "Approval required"; the mock payload shows `auto_execute:false`. |
| 9 | Simulated AI triage | A labelled deterministic, human-approved note appears and never claims autonomous action. |
| 10 | Copy JSON | "Copy JSON" copies the payload and shows a status message. |
| 11 | Keyboard | Tab reaches skip link → nav → filters → search → rows → case controls, each with a visible focus ring. |
| 12 | Reduced motion | With `prefers-reduced-motion`, smooth scroll and transitions are disabled. |

## Verification record (2026-07-16)

Checked with the committed source tests plus manual browser QA against the running page:

- **Rendering** — 8 incident rows, 4 OST opportunities, 4 pain points, 2 taxonomy tables, AI
  triage populated; title/`<h1>` correct.
- **MTTR** — median 55m vs 40m target; per class: ACH return 75m (over), Bank-link 14m (ok),
  Bank auth 40m (over), Event-sync 12m (ok). Bar geometry set via CSSOM.
- **Contrast** — every sampled text/background pair ≥ 4.5:1 (lowest 6.33); input border ≥ 3:1.
- **Semantics** — taxonomy is a real `<table>` with 15 `scope="row"` headers and no `role="table"`.
- **Focus management** — selecting R03 moves `document.activeElement` to the case heading.
- **Security** — strict CSP active with no console violations; stylesheet + script load under `'self'`.

## AI feature

The triage prompt contract is covered by the promptfoo regression suite — see
[`eval/README.md`](eval/README.md). It asserts the backfire controls (no autonomous-action
claims, R10≠R11, no fabricated ACH codes for operational signals, correct escalation).
