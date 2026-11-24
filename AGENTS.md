<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Antigravity Agent Guidelines & Impeccable Design System

## 1. Overview & Philosophy

Antigravity operates on the Valoria Tech codebase with an uncompromising standard of **out-of-distribution craft**. We reject generic AI templates ("AI slop") in favor of deliberate, production-grade frontend engineering, fluid Apple-grade physical motion, and tactile luxury interfaces.

Our frontend design combines:
1. **Apple Design Foundations (`apple-design` skill)**: Fluid interruptible spring physics, zero input latency, 1:1 direct manipulation tracking, translucent glass materials (`backdrop-blur`), and optical typography.
2. **Impeccable Design Vocabulary (`impeccable` skills)**: 24 targeted steer/review/finish commands, strict craft floors, and deterministic anti-pattern detection.
3. **MapCN (`mapcn` skill)**: MapLibre GL + Tailwind thematic spatial data visualizations.

---

## 2. Impeccable Skills in Antigravity

The following skills are installed in `.agents/skills/` and `.agent/skills/` and are automatically available to Antigravity:

| Skill | Invocation | Primary Purpose |
|---|---|---|
| `impeccable` | `/impeccable [command]` | Master design director skill containing all 24 design playbooks, reference guides, and the native CLI engine. |
| `audit` | `/audit [target]` | Technical quality audit: accessibility (a11y), performance, responsive reflow, and 62 deterministic anti-pattern checks (P0–P3 severity). |
| `critique` | `/critique [target]` | UX design review with quantitative heuristic scoring, information hierarchy analysis, and cognitive load assessment. |
| `polish` | `/polish [target]` | Final pre-shipping pass: micro-alignment, spacing rhythm, border contrast, specular highlights, and edge finish. |
| `bolder` | `/bolder [target]` | Elevate safe or bland designs into distinct, memorable, high-character interfaces with strong visual hierarchy. |
| `animate` | `/animate [target]` | Add purposeful spring animations, micro-interactions, and velocity-aware transitions. |
| `typeset` | `/typeset [target]` | Fine-tune typographic scale, optical sizing, tracking (`tracking-tight`), line height, and font pairing. |

### Additional Impeccable Sub-Commands (`/impeccable <cmd>`)
- **Steer**: `quieter` (tone down aggressive UI), `distill` (strip clutter to essence), `colorize` (infuse strategic palette), `layout` (composition & spacing rhythm), `delight` (tactile personality), `overdrive` (shaders & advanced spring physics).
- **Finish**: `harden` (error states, i18n, text overflow, resilient edge cases), `clarify` (UX microcopy & labels), `adapt` (viewport reflow & device ergonomics), `optimize` (render speed & CWV), `onboard` (first-run flows & empty states).
- **Plan & System**: `init` (durable product context `PRODUCT.md`), `document` (design system tokens `DESIGN.md`), `shape` (pre-code UX discovery), `extract` (token consolidation).

---

## 3. Impeccable Craft Floor & Anti-Pattern Bans

Always check and enforce these quality floor rules before writing or modifying frontend code:

1. **Strictly Forbidden Patterns ("AI Slop")**:
   - ❌ Generic purple-to-blue or pastel rainbow gradients.
   - ❌ Inter-only typography for everything; use distinct display faces, intentional weights, and monospace accents.
   - ❌ Cards nested inside cards with identical border radii.
   - ❌ Low-contrast gray text on tinted/colored backgrounds.
   - ❌ Rounded-square icon tiles stacked mechanically above every heading.
   - ❌ Fake CSS skeuomorphism or inconsistent lighting sources.
   - ❌ Upward translations on hover (`y: -offset`) that cause perimeter cursor vibration/jitter.

2. **Mandatory Craft Standards**:
   - **Tactile Depth**: Use subtle translucent backgrounds (`bg-[#10131E]/80`), specular borders (`border border-white/[0.08]`), and ambient drop shadows (`shadow-[0_14px_36px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]`).
   - **Apple Spring Physics**: When animating, use spring physics (`type: "spring", stiffness: 120-380, damping: 24-28`) rather than linear or ease-in-out CSS transitions.
   - **Instant Feedback**: Respond immediately on `pointerdown` / `active:scale-[0.98]`.
   - **Touch & Accessibility**: Ensure minimum tap target of 44×44px, semantic HTML, and proper ARIA labeling.

---

## 4. Impeccable Engine CLI

The native Impeccable engine binary is located at `.agents/skills/impeccable/scripts/impeccable`. Antigravity can run:

```bash
# Scan components for UI anti-patterns and quality regressions
.agents/skills/impeccable/scripts/impeccable detect <file-or-dir>

# Pin or unpin shortcut skills into .agents/skills/
.agents/skills/impeccable/scripts/impeccable pin pin <command>
.agents/skills/impeccable/scripts/impeccable pin unpin <command>
```

---

## 5. Specialist Subagents

For multi-stage design and audit workflows, Antigravity can leverage the specialized Impeccable subagent prompts located in `.agents/skills/impeccable/agents/`:
- **`impeccable-finish-reviewer`**: Impartial quality gate reviewing completed builds against direction contracts.
- **`impeccable-documenter`**: Extracts design system specifications into `DESIGN.md`.
- **`impeccable-asset-producer`**: Authors precision SVG and graphic assets.
- **`impeccable-manual-edit-applier`**: Safely applies targeted design patches without code drift.

