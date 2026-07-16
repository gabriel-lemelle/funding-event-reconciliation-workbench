# Security policy

The public workbench is a static portfolio prototype with synthetic data. It has no backend, credentials, PII, form submission, third-party runtime script, live model, or financial-system connection.

## Controls

- A strict CSP allows only local script/style/image/font resources and blocks all connections.
- Search input is used only for filtering and never reaches an HTML sink.
- External links isolate the opener.
- Policy-sensitive mock payloads set `auto_execute:false` and list required approvals.
- The optional evaluator is pinned in `package-lock.json`; install it before setting an API key.

Report security issues privately to the repository owner rather than placing sensitive details in a public issue.
