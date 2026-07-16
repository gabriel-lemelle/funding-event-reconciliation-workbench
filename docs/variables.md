# Variables and secrets

The public site requires no variables or secrets.

The optional Promptfoo evaluation requires the operator's local `ANTHROPIC_API_KEY`. Install the pinned lockfile with `npm ci --ignore-scripts` before setting the key, run `npm run eval`, and never commit the key or eval output. The evaluation toolchain is development-only and is not shipped to GitHub Pages.
