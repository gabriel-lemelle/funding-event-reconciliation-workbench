# Testing

This is a static, dependency-free site, so the test strategy is a **critical-path smoke
checklist** plus an automated **promptfoo** suite for the one AI feature. No framework or
build step is added — that would be disproportionate for an 8-scenario demo and would work
against the "plain HTML/CSS/JS" scope.

## How to run the smoke checklist

Serve the page (`python -m http.server 4178`) and walk the paths below. Each was verified
during the build via scripted DOM assertions (computed styles, contrast ratios, focus, and
structure) — results recorded under "Verification record."

## Critical paths

| # | Path | Expected |
|---|---|---|
| 1 | Page loads | Title and `<h1>` read "Funding Event Reconciliation Workbench"; no console errors; CSP active. |
| 2 | Discovery renders | Persona, 4 ranked pain points, JTBD, riskiest assumption, and 4 OST opportunities are visible. |
| 3 | Metric strip | Median MTTR, safe-by-policy %, reconciliation lag, and open-exception count populate (all labelled synthetic). |
| 4 | Metric tree | 4 per-class MTTR cards render with current vs target bars; over-target classes are visually distinct (fill + "Over target" text). |
| 5 | Queue select | Clicking an incident updates the case panel and **moves focus to the case heading**. |
| 6 | Filters | Each filter narrows the queue; the active filter shows `aria-pressed="true"` + a fill cue; "All" restores. |
| 7 | Search | Typing (e.g. `R10`, `Plaid`) filters rows; no match shows the empty state. |
| 8 | Guardrail posture | Regulated cases (R10/R07/R11) show "Approval required"; the mock payload shows `auto_execute:false`. |
| 9 | AI triage draft | A labelled "draft, human-approved" note appears for the selected case and never claims autonomous action. |
| 10 | Copy JSON | "Copy JSON" copies the payload and shows a status message. |
| 11 | Keyboard | Tab reaches skip link → nav → filters → search → rows → case controls, each with a visible focus ring. |
| 12 | Reduced motion | With `prefers-reduced-motion`, smooth scroll and transitions are disabled. |

## Verification record (this build)

Checked via scripted DOM/CSSOM assertions against the running page:

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
