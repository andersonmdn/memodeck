# MemoDeck — Design System

<!-- impeccable:design-schema 1 -->

## World

Precision dark tool. Depth through graduated surfaces, never through decoration. The visual grammar sits in the same family as Linear, Raycast, and Vercel — restrained, structured, premium.

## Color

**Strategy:** Restrained — four neutral surface steps + one accent.

**Surfaces (indigo-tinted neutrals):**
| Token | Hex | Role |
|---|---|---|
| `--color-background` | `#0c0c10` | Page base, content area |
| `--color-sidebar` | `#111116` | Sidebar panel (distinct layer above background) |
| `--color-surface` | `#18181f` | Cards, primary elevated surfaces |
| `--color-surface-2` | `#21212a` | Inputs, code blocks, secondary panels |
| `--color-surface-3` | `#2a2a34` | Hover backgrounds, selected states |

**Borders:**
| Token | Hex | Role |
|---|---|---|
| `--color-border-subtle` | `#1c1c26` | Hairline separators |
| `--color-border` | `#2c2c3a` | Standard visible border |
| `--color-border-strong` | `#3c3c4e` | Focus rings, active states |

**Text:**
| Token | Hex | Role |
|---|---|---|
| `--color-text` | `#f1f1f7` | Primary — cool white |
| `--color-text-muted` | `#8a8a9e` | Secondary labels, metadata |
| `--color-text-subtle` | `#58586e` | Tertiary, hints, timestamps |

**Accent:** Violet-600 `#7c3aed` — primary actions, progress, focus, active indicators. Used consistently; never decoratively.

**Semantic:** success `#22c55e`, warning `#f59e0b`, danger `#ef4444`.

## Typography

- **Family:** Inter for all text — single face across all sizes and roles
- **Body measure:** 65–75ch for prose; product labels/data may run denser
- **Scale ratio:** ~1.125 between steps
- **Antialiasing:** `-webkit-font-smoothing: antialiased`

## Shape

| Token | Value | Application |
|---|---|---|
| `--radius-sm` | `4px` | Badges, tags, small controls |
| `--radius-md` | `6px` | Inputs, buttons |
| `--radius-lg` | `8px` | Cards, popovers |
| `--radius-xl` | `12px` | Dialogs, large cards |

## Elevation

Cards carry `box-shadow: 0 1px 8px rgba(0,0,0,0.35)` to float above background. Overlays (dropdown, dialog) use `--color-surface-2` as background — two stops above the page base. No glass, no gradient overlays, no neon glow.

## Component vocabulary

- **Buttons (primary):** violet fill + `shadow-[0_1px_6px_rgba(124,58,237,0.35)]`; hover darkens fill
- **Buttons (secondary):** `surface-2` fill + `border` border; no shadow
- **Inputs:** `surface-2` background (recessed below card surface); border on default; accent ring on focus
- **Cards:** `surface` background + `border-subtle` border + `shadow-[0_1px_8px_rgba(0,0,0,0.35)]`; hover lifts (`-translate-y-px` + border strengthens)
- **Sidebar:** `sidebar` background, `border-subtle` right divider; active item = `accent/12` fill + accent text
- **Dropdowns / popovers:** `surface-2` background, `border` border, `shadow-lg`
- **Badges:** filled at 15% accent opacity + 30% border; secondary uses `surface-2`
- **Progress:** track at `surface-2`, fill at accent

## Prohibitions

- No gradient text
- No glass / backdrop-blur as decoration
- No neon / glow effects except the primary button's subtle violet shadow
- No colored border-left/right accent bars on cards
- No absolute black `#000000` — all backgrounds carry the indigo tint
- No `bg-[--color-*]` arbitrary values without `var()` — always `bg-[var(--color-*)]`
