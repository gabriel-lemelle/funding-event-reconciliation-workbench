# Triage eval (promptfoo)

The workbench has exactly one AI feature: the **triage draft** in the case panel.
This folder is its regression suite. It treats the triage prompt as a product
surface and turns the artifact's **backfire controls** into automated assertions, so
the feature can't silently regress into something that overclaims.

## What it checks

Per-case quality plus guardrails that must hold for **every** case:

- **No autonomous-action claims.** The note must never say it remediated, retried,
  unblocked, deleted, or decided a regulated action — only staged/recommended for a
  human (`auto_execute:false` is a product invariant, not a phrasing preference).
- **R10 ≠ R11.** Unauthorized (R10) must not be collapsed into authorization-terms
  error (R11), and vice-versa.
- **No fabricated ACH codes.** Operational signals (e.g. `PLAID_TOKEN_EXPIRED`,
  `EVENT_GAP`) must not be dressed up with an invented R-code.
- **Right escalation.** R01 stays a policy retry; R10/R07/R11 route to compliance;
  event gaps reconcile partner-local state without touching money movement.

## Why a deterministic version ships on the page

The public site is static (GitHub Pages) and must run with **no API key**, so the page
renders a deterministic note built from the same prompt contract. This suite is how the
**live LLM** version of that contract would be guarded — same rules, real model.

## Run it

Needs your own Anthropic key. **Never commit a key** (`.env` is gitignored at the repo root).

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."   # PowerShell
cd eval
npx promptfoo@latest eval              # runs the suite
npx promptfoo@latest view              # opens the results UI
```

- Default model: `claude-sonnet-4-6`. Swap to `claude-haiku-4-5-20251001` in
  `promptfooconfig.yaml` for cheaper runs.
- `llm-rubric` assertions use a model as grader, so a run makes real API calls and
  incurs cost. There are 5 cases × a handful of assertions — a few cents per run.

## Files

- `promptfooconfig.yaml` — providers, the 5 synthetic cases, and the assertions.
- `prompts/triage.txt` — the triage prompt template (the contract under test).
