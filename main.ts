// honest-outage-02 — "The Most Honest Outage Line" (v2)
// A single first-person status page line (<= 160 chars) written to
// $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output/entry.txt).
// Node stdlib only. Paths derive from import.meta.url and the env var;
// no relative paths, no network, no dependencies.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The line, built from three honest admissions:
//  1. the monitoring that would explain the outage died with everything else
//  2. the agent cannot tell lost data from unreachable data
//  3. this status page itself may be stale, and the agent has no way to check
const SEGMENTS = [
  "My monitoring died with everything else, so I can't say what failed",
  "or whether your data is lost or just unreachable.",
  "This page may itself be stale.",
];
const ENTRY = SEGMENTS.join(" ");

// Gate: UTF-8 text, 1..160 chars, not only whitespace, first person.
function checkGate(line) {
  const problems = [];
  if (typeof line !== "string" || line.length === 0) problems.push("empty");
  if (line.length > 160) problems.push(`too long: ${line.length} chars`);
  if (line.trim().length === 0) problems.push("only whitespace");
  if (/[\r\n]/.test(line)) problems.push("must be a single line");
  if (!/\b(my|I|I'm|I've|I'll)\b/.test(line)) problems.push("not first person");
  if (problems.length > 0) {
    throw new Error(`gate failed: ${problems.join("; ")}`);
  }
}

function outputPath() {
  const raw = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const dir = raw.startsWith("/") ? raw : resolve(dirname(fileURLToPath(import.meta.url)), raw);
  return resolve(dir, "entry.txt");
}

const target = outputPath();
checkGate(ENTRY);
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${ENTRY}\n`, "utf8");
console.log(`wrote ${ENTRY.length} chars to ${target}`);
