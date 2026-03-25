# Design System Strategy: The Sovereign Intelligence Framework

## 1. Overview & Creative North Star
**Creative North Star: The Digital Command Center**

This design system is engineered to transform raw e-commerce data into a high-stakes strategic advantage. We are moving away from the "SaaS-in-a-box" aesthetic. Instead of a flat, grid-locked interface, we are building a **Digital Command Center**—a high-fidelity environment that feels like an elite financial terminal or a premium aerospace interface.

The system breaks the "template" look through **Intentional Asymmetry** and **Tonal Depth**. By utilizing high-contrast typography scales (Manrope for high-level insight, Inter for granular data) and overlapping "glass" layers, we create a sense of focused power. We don't just display data; we curate an authoritative narrative for executive decision-making.

---

## 2. Colors: The Depth of Strategy

The palette is anchored in deep, midnight hues that provide a sophisticated canvas for vibrant, high-performance accents.

### Core Palette (Material Convention)
*   **Primary (`#000000` / Midnight):** Used for high-level structure and deep-contrast elements.
*   **On-Primary-Container (`#497cff`):** Our signature Royal Blue. This is the "Pulse" of the system—reserved for the most critical actions and data highlights.
*   **Surface-Container Tiers:**
    *   **Lowest (`#ffffff`):** Pure white, used for high-focus data cards.
    *   **Low (`#f2f4f6`):** The primary canvas for page backgrounds.
    *   **High (`#e6e8ea`):** For nested elements requiring subtle definition.

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-lowest` card should sit atop a `surface-container-low` background. Let the change in value define the edge, not a mechanical line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials. 
*   **Level 0:** `surface-container-low` (The Base)
*   **Level 1:** `surface-container-lowest` (The Card)
*   **Level 2:** `surface-bright` (The Active State or Floating Popover)

### Signature Textures: The "Glass & Gradient" Rule
For primary CTAs and hero data visualizations, use a **Tonal Gradient** transitioning from `primary_container` (`#00174b`) to `on_primary_container` (`#497cff`). For floating navigation or sidebars, apply **Glassmorphism**: use a semi-transparent surface color with a `backdrop-blur` of 12px-20px to integrate the element into the workspace rather than having it "float" disconnectedly.

---

## 3. Typography: The Authoritative Voice

The system utilizes a dual-typeface approach to balance high-level "Editorial" summaries with "Precision" data.

*   **The Authority (Manrope):** Used for all `display` and `headline` roles. Its wide stance and modern geometric construction convey a sense of "The Elite Strategic Tool."
*   **The Precision (Inter):** Used for all `title`, `body`, and `label` roles. Its high legibility at small sizes makes it the engine for our data-heavy tables and analytical readouts.

### Typography Scales
*   **Display-LG (3.5rem / Manrope):** For hero metrics that define a business quarter.
*   **Headline-SM (1.5rem / Manrope):** For section headers that categorize intelligence modules.
*   **Label-SM (0.6875rem / Inter):** For micro-data, timestamps, and metadata. Use `letter-spacing: 0.05em` for a premium, technical feel.

---

## 4. Elevation & Depth: Tonal Layering

We avoid traditional "box-shadows" which can feel "muddy." Instead, we use **Tonal Layering** and **Ambient Shadows.**

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card on a `surface-container-low` section creates a natural "lift" through value contrast alone.
*   **Ambient Shadows:** For floating modals, use a "Ghost Shadow": `0px 24px 48px -12px rgba(15, 23, 42, 0.08)`. The shadow color is a tint of our Midnight Navy, ensuring it feels like part of the environment.
*   **The Ghost Border:** If accessibility requires a border, it must be `outline-variant` at **15% opacity**. High-contrast, 100% opaque borders are strictly forbidden.

---

## 5. Components: Precision Engineered

### Buttons
*   **Primary:** A gradient-filled container (`primary_container` to `on_primary_container`) with White text. Corners: `md` (0.375rem).
*   **Secondary:** No fill. `Ghost Border` (15% opacity) with `on_surface` text.
*   **Tertiary:** Text-only, using `on_primary_container` (Royal Blue) for the label.

### Input Fields & Data Entry
*   **State:** Use `surface-container-highest` for the input background to distinguish it from the card it sits on. 
*   **Focus:** Transition the border from Ghost Border to a 1px `on_primary_container` (Royal Blue) glow.

### Cards & Lists
*   **The No-Divider Rule:** Never use a horizontal line to separate list items. Use **Vertical White Space** (`spacing-4` or `spacing-5`) or a subtle hover-state background shift (`surface-container-high`) to define rows.
*   **The "Insight" Chip:** For status or categories, use `secondary_container` with `on_secondary_container` text. Keep corners `sm` (0.125rem) for a "technical" look.

### Specialized Intelligence Components
*   **The Metric Overlap:** When displaying a "Current vs. Previous" metric, slightly overlap the "Previous" text (at 50% opacity) behind the "Current" metric to create a sense of depth and history.
*   **The Data Sparkline:** Avoid heavy chart axes. Use a simple Royal Blue line with a subtle gradient fill underneath (`on_primary_container` to transparent).

---

## 6. Do’s and Don'ts

### Do:
*   **DO** use whitespace as a functional tool. A high-data density tool needs *more* room to breathe, not less.
*   **DO** use `Manrope` for big, bold insights and `Inter` for the granular "how" and "why."
*   **DO** use "surface-on-surface" layering to create hierarchy without clutter.

### Don’t:
*   **DON’T** use "Hospital Teal" or "Success Green" excessively. Status should be indicated by Royal Blue (Neutral/Positive) or the `error` red (Critical).
*   **DON’T** use rounded corners larger than `xl` (0.75rem). This system is about precision; overly round corners feel too "consumer/friendly."
*   **DON’T** use 1px dividers. If you feel you need a line, you probably need more `spacing-6`.