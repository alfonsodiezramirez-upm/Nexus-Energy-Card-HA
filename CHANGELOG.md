# Changelog

## 0.1.0

- Initial HACS-ready release.
- Adds `nexus-energy-card` Lovelace card and visual editor.
- Supports hierarchical live power routing, calculated rest nodes, proportional flow widths, source and consumer columns, configurable animation, background, zero-node hiding, polarity inversion, and per-node color thresholds.
- Starts the visual editor from an empty configuration and uses a vertical accordion tree builder.
- Adds hover/tap node tooltips with current values, parent percentages, cached Home Assistant history, and SVG sparklines.
- Fixes node editor accordions collapsing while typing after Home Assistant echoes config updates.
- Removes Energy mode controls and keeps the card focused on live power.
- Adds configurable overflow tolerance to absorb small real-time sensor sync mismatches.
- Sorts outgoing flow anchors by destination height for cleaner fan-out routing from busy parent nodes.
