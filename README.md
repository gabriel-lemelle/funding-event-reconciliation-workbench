# Funding Event Reconciliation Workbench

> When money movement fails, partner operations needs **one recovery truth** —
> what broke, whether retry is safe, who owns the next step, what evidence is needed,
> and the MTTR it affects — in one place, with a human approving any regulated action.

An independent product concept and interactive demo. It classifies a synthetic funding
failure, routes the owner, stages a **human-approved** next action, and shows the metric
it moves. ACH returns are one class of scenario inside a broader exception-observability
product.

**This is a portfolio artifact, not a production system.**
- Synthetic data only — no live API calls, no credentials, no PII.
- **Not affiliated with Alpaca.** Grounded in public docs; no endpoint is guaranteed accurate.
- **Not an autonomous Nacha/ACH agent.** It recommends and *stages*; it never executes a
  regulated remediation. `auto_execute:false` is a product invariant on regulated actions.

🔗 **Live demo:** <https://gabriel-lemelle.github.io/funding-event-reconciliation-workbench/>

---

## What it demonstrates

**Product discovery, available in a compact disclosure on the page** (not buried in code):

- **Persona** — primary *Partner Money-Movement Operations Lead*, secondary *Integration Developer*.
- **Ranked pain points** — product hypotheses are labelled as hypotheses; the R10/R11 domain
  distinction is grounded in the linked Nacha reference.
- **Job-to-be-done** — the recovery JTBD stated in full.
- **Opportunity Solution Tree** — desired outcome → four opportunities (O1–O4), each linked to
  where it is embodied in the workbench.
- **Riskiest assumption** — stated plainly, with how it would be invalidated.

**The metric that moves: MTTR per funding-failure class.**
A metric tree decomposes it (time-to-classify, time-to-route, time-to-safe-action). The summary
shows the count of policy-sensitive actions with human gates and the synthetic event-backfill
case's MTTR, rather than presenting those modeled values as observed success rates.

**The workbench itself.**
Eight synthetic incidents (R01/R03/R07/R10/R11 ACH returns + Plaid-token, bank-auth, and
SSE event-gap operational signals), each with risk, owner, runbook, decision guardrail,
source basis, evidence, event timeline, and a mock JSON handoff (`auto_execute:false` on
regulated actions).

**One AI feature, with rigor.**
The **simulated AI triage** generates a first-pass note for the selected case — clearly labelled
*deterministic draft, human-approved*; it never decides or executes. The page ships a deterministic version
of the prompt contract so it runs keyless. The live-LLM version is guarded by a
[promptfoo eval](eval/README.md) that turns the backfire controls into assertions.

---

## Run locally

It's a static site — no build step.

```bash
# simplest: open index.html in a browser, or serve it:
python -m http.server 4178
# then visit http://localhost:4178
```

The promptfoo eval is separate and needs your own key — see [`eval/README.md`](eval/README.md).

---

## Quality & ship-check

Audited statically before publishing; **no Critical/High launch blockers.**

| Area | Result |
|---|---|
| **Security** | No untrusted input reaches the DOM (search filters only; nothing user-entered is rendered). No third-party scripts, fonts, or network calls. Strict `Content-Security-Policy` with no `unsafe-inline`. External links use `rel="noopener noreferrer"`. No secrets committed. Synthetic data only. |
| **Performance** | One local HTML + CSS + JS file, no dependencies, no web fonts, no images; deferred script. Negligible payload; no render-blocking resources. |
| **Accessibility** | Targets **WCAG 2.2 AA** — see [Accessibility](#accessibility). |
| **Tests** | Built-in Node source-contract tests + browser smoke record in [`TESTING.md`](TESTING.md); pinned promptfoo suite for the AI feature. |

## Accessibility

Built to **WCAG 2.2 AA**:

- Text contrast verified empirically — every text/background pair ≥ 4.5:1.
- Visible `:focus-visible` rings on all controls; master-detail **focus management** (selecting
  an incident moves focus to the case heading).
- Real `<table>` semantics for the taxonomy (`scope` row/column headers + caption).
- `aria-pressed` filters, `aria-current` queue rows, skip link, labelled new-tab links.
- Non-text contrast ≥ 3:1 on inputs and active states; active filter uses a fill + checkmark cue,
  not colour alone (1.4.1).
- Honors `prefers-reduced-motion`.

## Tech & decisions

- **Plain HTML / CSS / JS, intentionally.** This is a level-up of the original V1; a framework
  rewrite wouldn't raise the bar for an 8-scenario demo, and a zero-dependency static site is
  the most robust, fastest, and most reviewable form for it.
- **Design tokens** — a documented token system in `:root` (surface elevation scale, radius
  scale, focus-ring, semantic colour) drives the UI; no magic values, no inline styles.
- **Honest AI posture** — the one AI feature is a labelled draft with a human in the loop and an
  eval beside it, rather than an overclaimed "agent."

## Source basis

Public references used for product framing (synthetic cases only; nothing below implies an
Alpaca endpoint is accurate):

- [Alpaca ACH funding](https://docs.alpaca.markets/us/docs/ach-funding)
- [Alpaca SSE events](https://docs.alpaca.markets/us/docs/sse-events)
- [Alpaca Broker API dashboard filters](https://alpaca.markets/learn/introducing-new-filters-to-broker-api-dashboard)
- [Nacha R10/R11 differentiation](https://www.nacha.org/rules/differentiating-unauthorized-return-reasons)
- [ACH return-code reference (Goldman Sachs)](https://developer.gs.com/docs/services/transaction-banking/ach-return-codes/)
- [Plaid payment initiation](https://plaid.com/docs/payment-initiation/)

## Structure

```
index.html     # page shell + Discovery, Workbench, Metric tree, Taxonomy, Sources
styles.css     # design tokens + component styles
app.js         # synthetic scenarios + rendering, metric computation, simulated triage draft
eval/          # promptfoo guardrail suite for the AI feature (needs your own key)
tests/         # zero-runtime-dependency source-contract tests
package.json   # test scripts + exact eval-tool pin (not shipped to the page)
TESTING.md     # critical-path smoke checklist + verification record
```
