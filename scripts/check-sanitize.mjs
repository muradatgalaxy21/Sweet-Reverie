// Run: node --experimental-strip-types scripts/check-sanitize.mjs
import assert from "node:assert/strict";
import { sanitizeDescription } from "../src/lib/sanitize.ts";

const out = sanitizeDescription(
  `<h2>Title</h2><p>Hi <strong>a</strong> <em>b</em><br></p><ul><li>x</li></ul>` +
    `<script>alert(1)</script><img src=x onerror="alert(1)"><p onclick="x()">c</p>` +
    `<a href="javascript:alert(1)">bad</a><a href="https://ok.com" target="_blank">good</a>`
);

assert.equal(
  out,
  `<h2>Title</h2><p>Hi <strong>a</strong> <em>b</em><br /></p><ul><li>x</li></ul>` +
    `<p>c</p><a>bad</a><a href="https://ok.com">good</a>`
);
console.log("sanitize check OK:", out);
