import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [html, js, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
]);

test('page keeps a strict, keyless runtime boundary', () => {
  assert.match(html, /connect-src 'none'/);
  assert.doesNotMatch(html, /<script[^>]+src=["']https?:/i);
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(js, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /id="sourceLink" href="#"/);
});

test('all document IDs are unique', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('JavaScript ID selectors resolve to document elements', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const selected = new Set(
    [...js.matchAll(/querySelector\(["']#([^"']+)["']\)/g)].map((match) => match[1]),
  );
  const missing = [...selected].filter((id) => !ids.has(id));
  assert.deepEqual(missing, []);
});

test('approval filter and metric share the canonical payload rule', () => {
  assert.match(js, /function requiresApproval\(scenario\)/);
  assert.match(js, /state\.filter === "approval" \? requiresApproval\(scenario\)/);
  assert.match(js, /scenarios\.filter\(requiresApproval\)\.length/);
  assert.doesNotMatch(js, /tags\.includes\("approval"\)\.length/);
});

test('empty results hide stale detail and announce the state', () => {
  assert.match(html, /id="queue-caption" role="status" aria-live="polite"/);
  assert.match(js, /if \(!visible\.length\) \{/);
  assert.match(js, /casePanel\.hidden = true/);
});

test('active filters have a non-color selected cue', () => {
  assert.match(css, /\.filter-button\[aria-pressed="true"\]::before/);
  assert.match(css, /content: "✓"/);
});
