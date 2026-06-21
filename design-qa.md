# Design QA - Nexus Energy Card

Reference visual: Product Design ImageGen option 1, "Glass Grid".

Prototype: http://127.0.0.1:5174/

## Captures

- Desktop: `design-qa-screenshots/desktop.png` at 1440 x 1024.
- Mobile: `design-qa-screenshots/mobile.png` at 390 x 844.
- Column layout desktop: `design-qa-screenshots/desktop-columns.png` at 1440 x 1024.
- Column layout mobile: `design-qa-screenshots/mobile-columns.png` at 390 x 844.
- Laminar routing desktop: `design-qa-screenshots/desktop-laminar.png` at 1440 x 1024.
- Laminar routing mobile: `design-qa-screenshots/mobile-laminar.png` at 390 x 844.
- Volume routing desktop: `design-qa-screenshots/desktop-volume.png` at 1440 x 1024.
- Volume routing mobile: `design-qa-screenshots/mobile-volume.png` at 390 x 844.
- Clean layout desktop: `design-qa-screenshots/desktop-clean.png` at 1440 x 1024.
- Clean layout mobile: `design-qa-screenshots/mobile-clean.png` at 390 x 844.
- Editor zero-state desktop: `design-qa-screenshots/editor-zero-desktop.png` at 1120 x 1100.
- Editor mobile: `design-qa-screenshots/editor-mobile.png` at 390 x 844.
- Editor accordion desktop: `design-qa-screenshots/editor-accordion-desktop.png` at 1120 x 1400.
- Tooltip desktop: `design-qa-screenshots/tooltip-desktop.png` at 1440 x 1024.
- Tooltip mobile: `design-qa-screenshots/tooltip-mobile.png` at 390 x 844.

## Checks

- Visual structure: passed. The implementation follows the selected dark glassmorphic power-map direction with left sources, central home hub, right-side hierarchy, curved glowing flows, live metric, and diagnostic pill.
- Production cleanup: passed. Mockup-only zoom controls and static bottom KPIs were removed from the rendered card, leaving the graph stage as the dominant content region.
- Runtime render: passed. The card renders nonblank in Chrome headless after Lit hydration.
- Desktop layout: passed. No clipped root content; visible nodes retain readable text and stable rounded glass surfaces.
- Mobile layout: passed. The layout switches from a ResizeObserver-measured container breakpoint at 600 px, uses vertical flow routing, stacks sources above the home node, and places child consumers in a compact one/two-column grid without horizontal clipping.
- Strict column layout: passed. Same-depth child nodes share the same X axis, device cards use a fixed 304 x 72 geometry, parent nodes are vertically centered against the total height of their child group, and calculated `Resto` nodes stay in the same structural column as real siblings.
- Laminar SVG routing: passed. Horizontal Bezier paths use the strict `M x1 y1 C x1+offset y1, x2-offset y2, x2 y2` formula, with the offset fixed to half the X distance between the connected columns.
- Compact SVG routing: passed. Vertical Bezier paths leave parent nodes from the bottom edge, enter child nodes from the top edge, keep vertical tangents, use a dynamic 45% vertical offset, and map bottom anchors to child grid columns by real X position to avoid crossings.
- Distributed parent anchors: passed. Multi-child parent outputs are evenly spaced along the right border so sibling paths fan out without sharing the same origin.
- Destination-ordered anchor slots: passed. Parent outputs are assigned from top to bottom using the rendered Y position of each child, keeping the fan-out clean when a parent has many outgoing paths.
- Distributed source anchors: passed. Solar, Bateria, Red and Generador enter `Casa` through separate left-border anchor slots, measured at Y positions 375, 457, 539, and 621 in the desktop QA viewport.
- Dynamic flow volume: passed. Power-mode SVG paths now map live values to proportional `stroke-width`, with residual paths at 2 px and the largest visible flow at 10 px; the browser QA check found 13 distinct widths across 15 paths.
- Balanced horizontal rhythm: passed. The source column, `Casa`, and the first hierarchy column now keep symmetric left/right gaps, with tests guarding a minimum 52 px desktop spacing.
- Left-column rhythm: passed. Source cards use the same 16 px vertical cadence as right-side sibling device groups.
- Visual editor structure: passed. The editor exposes general settings, main home entity, parent-child node builder, appearance controls, animation controls, zero-node cleanup, and color thresholds in separated dense panels without horizontal scrolling.
- Editor height ownership: passed. The visual editor no longer exposes a manual `height` field; legacy height values are stripped from edited configs so Home Assistant/card content owns sizing.
- Editor zero-state: passed. New editor configs start with `nodes: []` and `sources: []`; the builder initially shows only the large `Anadir Primer Nodo` action.
- Editor accordion: passed. Node rows render as compact summaries by default, expand into a one-column form, and keep only one form open at a time.
- Editor interactions: passed. CDP editor smoke test verified zero-state startup, first-node creation, source creation, one-column node fields, one-column threshold fields, no horizontal overflow, add-threshold, and `config-changed` emission.
- Tooltip data: passed. Desktop CDP check verified debounced hover, raw current entity value, parent percentage text, 44 Home Assistant history samples, SVG path rendering, 60 second cache reuse with no second history call, and background close.
- Tooltip mobile interaction: passed. Mobile CDP check verified tap-to-open, tap-same-node-to-close, tap-other-node-to-switch, and tap-background-to-close behavior.
- Tooltip positioning: passed. Desktop tooltip stayed inside the graph stage when opened from the right-side hierarchy; mobile tooltip remained inside the card viewport.
- Geometric parent centering: passed. Parent center Y is computed from the average center Y of its first and last visible child, including root-level `Casa` and nested parents.
- Interactions: passed. CDP smoke test verified Cocina branch expansion and hover tooltip display.
- Data logic: passed. Unit tests cover automatic rest node calculation, configurable overflow tolerance, overflow clamping/logging, reverse flow direction for negative bidirectional values, strict columns, compact child grids, compact anti-crossing anchor order, parent centering, source and parent slot distribution, dynamic flow widths, balanced gaps, and cubic path control points.
- Console health: passed. No runtime exceptions. Expected warnings only: Lit dev-mode warning and the intentional Cocina overflow diagnostic.

## Fixed During QA

- Reworked demo `ha-icon` stub to use Shadow DOM so it cannot mutate Lit-owned marker nodes.
- Increased central node/layout height to prevent clipping of gauge and stats.
- Made horizontal scene height follow visible node extents so lower branches do not collide with the footer.
- Rebuilt mobile layout as a compact vertical hierarchy and capped mobile node width.
- Ignored temporary browser QA profiles in Vite watcher to prevent file-lock crashes.
- Replaced the free horizontal tree layout with a strict column layout and fixed sibling rhythm.
- Added subtle dashed styling for calculated `Resto` nodes while preserving the same bounding box as sibling devices.
- Added edge slot metadata so SVG paths can distribute parent output anchors and target entry anchors deterministically.
- Added configurable overflow tolerance so small child-over-parent sync mismatches resolve to `Resto 0 W` without warning styling or health-pill counts.
- Rebuilt compact geometry around the card content width instead of viewport media queries, with a debounced ResizeObserver and a CDP compact smoke test.
- Removed manual height configuration from the editor and documentation.
- Refined compact routing with X-sorted child slots, 40 px parent-grid breathing room, and CDP checks for crossing-free mapping.
- Kept reverse-flow particles moving backward with SVG `keyPoints` while preserving the same canonical parent-to-child path geometry.
- Added proportional Sankey-style stroke widths for power paths.
- Rebalanced the desktop source column width and right padding so the left-center and center-right Bezier corridors have matching visual breathing room.
- Added CDP flow QA to verify non-static stroke widths and distributed source input anchors in the rendered shadow DOM.
- Rebuilt the Lovelace visual editor around the novice workflow: choose the house sensor, add nodes, choose each parent, and let the card build the nested config.
- Added runtime support for editor-controlled options: base line width, animation speed, background style, zero-node hiding, inverted polarity, base flow color, and per-node color thresholds.
- Removed the Energy mode controls and the top-right `Ahora` pill so the production card stays focused on live power.
- Added a local editor demo route at `/?editor=1` plus CDP editor QA coverage.
- Removed non-functional zoom controls and static footer KPIs from the card UI, then tightened top/bottom padding around the graph.
- Split the editor startup config from the demo config so Home Assistant no longer injects mock entities into new cards.
- Reworked the node builder into a vertical accordion with full-width fields and strict overflow-x containment.
- Added Home Assistant history-backed node tooltips with a 250 ms hover debounce, 60 second cache, mobile click toggling, dynamic bounds-aware placement, and native SVG sparklines.

final result: passed
