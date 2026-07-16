# Architecture

This is a static, keyless HTML/CSS/JavaScript portfolio product hosted on GitHub Pages. `index.html` supplies semantic structure, `styles.css` owns the tokenized responsive design, and `app.js` owns eight hardcoded synthetic incidents plus deterministic rendering.

There is no backend, database, login, runtime package, fetch, analytics SDK, form submission, or live model call. Search input only filters existing records; it is never rendered into HTML. Case detail, metrics, taxonomy, and mock JSON are derived from local constants.

The separate `eval/` workflow tests how a future live-model triage prompt should behave. It is not loaded by the public page.

## Trust boundaries

- Public documentation links are evidence references, not live product integrations.
- All incident and partner values are synthetic.
- Policy-sensitive mock actions set `auto_execute:false` and name required approval owners.
- The visible simulated triage is deterministic text, clearly labelled as such.
