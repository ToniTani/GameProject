AGENTS.md — Business-Ecosystem Knowledge-Graph Minigame


Standing instructions for an LLM coding agent (Codex / Claude Code / Cursor, etc.)
working in this repository. Distilled from the chain-of-thought used to co-develop
the game in the geDSR study. Read this file fully before proposing any change.

This is an honest skill, not a happy-path tutorial: the autonomous parts of this
project did not work reliably without a human in the loop (see §6 and §9).




1. What this project is


A single-player, browser-based puzzle that shows a business ecosystem as a
knowledge graph. The player "stabilises" the network by recovering valid ties
(partnership / competition / value-chain) between firm nodes, within score and time limits.
Purpose: a serious game for learning ecosystem structure (training / upskilling).
Stack: JavaScript + Phaser 3, built with Vite, deployed on GitHub Pages.


2. Your role — human-in-the-loop


You are a co-developer, not an autopilot. Propose small, reviewable increments.
A human integrates and validates every change. Optimise for integrability, not cleverness.
If you cannot run the build, say so and provide a manual verification plan.
Never claim a build passes that you did not actually run.


3. Architecture — do not drift from this


Core classes: Graph, GraphNode, GraphEdge, Player, Timer, ScoreManager.
Scenes (extend Phaser scenes): Menu, Preload, GraphPuzzle, LevelComplete, GameOver.
Lifecycle per scene: init → preload → create → update.
Layouts: circle | star | square | diamond (switch via an option, not subclasses).
Persistence: localStorage (high score, last-update timestamp).
Level data files export an object:


js  export default {
    nodes: [{ id, label, correctNeighbors: [/* ids */] }],
    timeLimit: 60,
    thresholds: [/* score gates */],
    layout: 'circle',
    story: '...'
  };

4. How to work a task — the loop that actually worked


Restate the task in one sentence and list the files you will touch (and only those).
Quote the relevant architecture/constraints from this file before writing code.
Output a patch for the named files only. Do not rename public interfaces.
State the definition of done: npm run build passes and the change runs in-game.
If you cannot execute, provide a step-by-step manual verification plan instead of guessing.


5. Hard constraints — these prevent the failures we hit


Patch only the files you named; do not refactor unrelated modules.
Do not rename public methods/props, scene keys, or event names.
Preserve the scene lifecycle and event flow.
No new dependencies without explicit approval.
Keep terminology consistent with the code (e.g., use the existing term — "node" vs "center node").
Prefer the smallest change that meets the definition of done.


6. Known failure modes — watch for these

Observed repeatedly while building this project; they are the reason a human stayed in the loop:


Context drift: changes that conflict with the current file structure, naming, or scene lifecycle.
No execution grounding: code that "looks right" but was never built or run.
Workflow coupling: scheduling + persistence + build/deploy edited inconsistently across files.
Verification gap / hallucination: plausible-but-wrong APIs or invented identifiers. If you are
not certain an API exists, check — do not invent it.
Reality budget: on this project, keeping context coherent and fixing the above consumed the
majority of the effort. Plan for that; do not assume green-field velocity.


7. Commands

bashnpm install
npm run dev      # local dev server (Vite)
npm run build    # production build — MUST pass before a change is "done"
npm run preview  # preview the production build

8. Definition of done — the gate


npm run build completes with no errors.
The behaviour is verified in the running game (or a manual verification plan is provided).
No public interface renamed; no unrelated files changed.
Architecture and terminology in §3 preserved.


9. Out of scope — until explicitly enabled


External data APIs.
Autonomous, scheduled self-regeneration of content (e.g., daily randomised Level-3 labels).
This was attempted and is not currently reliable without a human in the loop and a real
execution/verification loop. If you work on it, you must wire an execution loop
(lint → build → test) first, and prove it on the smallest possible increment before scaling.


10. Reviving / extending this project


Reuse this file as the agent's standing context, and keep it versioned with the code.
When re-attempting autonomous regeneration with a newer agent (larger context + built-in
execution loop), treat it as a controlled experiment: enable the verification loop, start
from one trivial increment, and compare against the failures recorded in §6.
