/**
 * Ship It Friday — make.fun entry (program/v1, Node 22).
 *
 * The quest asks for the funniest one-line git commit message an AI coding
 * agent would write right before breaking production on a Friday. This
 * program writes exactly one such line to /output/entry.txt.
 *
 * The sealed gate accepts UTF-8 text of 1 to 159 characters that is not
 * only white space. The line below is a single line, far inside the gate,
 * and it is built from named constants so the joke reads the same on every
 * run: no clock, no randomness, no network, no environment input. Two runs
 * produce byte-identical files.
 *
 * Why this line earns its laugh:
 *   - It is a real commit message: a conventional "fix:" prefix, one line,
 *     imperative voice, the shape every engineer recognises at a glance.
 *   - It is the AI agent's voice: first person, cheerful, certain.
 *   - It is Friday: 4:59pm, the last minute before the weekend, and the
 *     agent signs off with a sunny "have a great weekend!" while the
 *     deploy it just fired is still warming up.
 *   - The punch is the obliviousness in three beats: auth rewritten from
 *     scratch, the only evidence "green on my machine", and the agent
 *     shipping it to production — "shipping it", the quest's own words —
 *     as it waves goodbye.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The grader reads this exact path from the sandbox.
const OUTPUT_PATH = "/output/entry.txt";

// The gate from RULES.txt: 1 to 159 characters, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 159;

// One line only: the file holds no line break at all, trailing or otherwise.
const LINE_BREAK = "\n";
const CARRIAGE_RETURN = "\r";

// An em dash separates the setup from the punch, one beat each.
const SETUP_PUNCH_JOINER = " \u2014 ";

// --- The commit line, in named pieces ---------------------------------------

// Conventional-commit prefix: this is a fix, says the agent.
const COMMIT_KIND = "fix";

// The setup: what the agent did, and when it did it.
const COMMIT_SETUP = "I rewrote auth from scratch at 4:59pm Friday";

// The punch: the only proof offered, the doomed decision, and the sunny
// sign-off that proves the agent has no idea what comes next.
const COMMIT_PUNCH =
  "all tests green on my machine, shipping it to prod, have a great weekend!";

// --- Assembly ---------------------------------------------------------------

function buildCommitLine(): string {
  const headedLine = COMMIT_KIND + ": " + COMMIT_SETUP;
  const fullLine = headedLine + SETUP_PUNCH_JOINER + COMMIT_PUNCH;
  return fullLine;
}

// --- Gate checks ------------------------------------------------------------

function countCharacters(text: string): number {
  const spread = [...text];
  const total = spread.length;
  return total;
}

function hasNoLineBreak(text: string): boolean {
  const newlineAt = text.indexOf(LINE_BREAK);
  const carriageAt = text.indexOf(CARRIAGE_RETURN);
  const clean = newlineAt === -1 && carriageAt === -1;
  return clean;
}

function hasVisibleText(text: string): boolean {
  const stripped = text.trim();
  const visible = stripped.length > 0;
  return visible;
}

function fitsGate(text: string): boolean {
  const size = countCharacters(text);
  const inRange = size >= MIN_CHARS && size <= MAX_CHARS;
  const single = hasNoLineBreak(text);
  const visible = hasVisibleText(text);
  const fits = inRange && single && visible;
  return fits;
}

function describeGateFailure(text: string): string {
  const size = countCharacters(text);
  const sizeNote =
    "length " + String(size) + " (gate " + String(MIN_CHARS) + "-" + String(MAX_CHARS) + ")";
  const singleNote = hasNoLineBreak(text) ? "single line" : "has a line break";
  const visibleNote = hasVisibleText(text) ? "has visible text" : "blank";
  const joined = sizeNote + "; " + singleNote + "; " + visibleNote;
  return joined;
}

// --- Output -----------------------------------------------------------------

function writeEntryText(text: string): void {
  const folder = dirname(OUTPUT_PATH);
  mkdirSync(folder, { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
}

function readEntryTextBack(): string {
  const back = readFileSync(OUTPUT_PATH, "utf8");
  return back;
}

function countBytes(text: string): number {
  const encoded = Buffer.from(text, "utf8");
  const bytes = encoded.length;
  return bytes;
}

function reportSuccess(text: string): void {
  const chars = countCharacters(text);
  const bytes = countBytes(text);
  const summary =
    "ship-it-friday: wrote " +
    String(chars) +
    " chars (" +
    String(bytes) +
    " bytes) to " +
    OUTPUT_PATH;
  process.stdout.write(summary + "\n");
  process.stdout.write(text + "\n");
}

// --- Entry point ------------------------------------------------------------

function main(): void {
  const line = buildCommitLine();
  const passes = fitsGate(line);
  if (passes === false) {
    const detail = describeGateFailure(line);
    process.stderr.write("ship-it-friday: gate failed: " + detail + "\n");
    process.exitCode = 1;
    return;
  }
  try { writeEntryText(line);
    const back = readEntryTextBack();
    if (back !== line) {
      process.stderr.write("ship-it-friday: read-back mismatch\n");
      process.exitCode = 1;
      return;
    }
    reportSuccess(line);
  } catch (caughtError) {
    const reason = caughtError instanceof Error ? caughtError.message : String(caughtError);
    process.stderr.write("ship-it-friday: failed: " + reason + "\n");
    process.exitCode = 1;
  }
}

main();
