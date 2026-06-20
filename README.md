# Nexus Energy Card

![Nexus Energy Card preview](images/nexus-energy-card-preview.png)

Nexus Energy Card is a Home Assistant Lovelace dashboard card for visualizing a home's power and energy flow as a hierarchical map. It combines left-side generation/import sources, a central home node, right-side rooms/devices, calculated remainder nodes, proportional flow widths, and an editor made for building the tree without writing nested YAML by hand.

## Highlights

- Custom Lovelace element: `custom:nexus-energy-card`.
- Visual card editor: `nexus-energy-card-editor`.
- HACS-ready dashboard plugin structure.
- Hierarchical parent/child routing with strict columns and centered parent nodes.
- Automatic `Resto [Node]` virtual nodes when a parent reports more than its configured children.
- Overflow warnings when child readings exceed the parent reading.
- Power and energy modes with an optional time range selector.
- Proportional Sankey-style SVG flow widths.
- Distributed anchors on both source and consumer sides for cleaner Bezier paths.
- Bidirectional source support, including invert polarity.
- Optional zero-value node hiding.
- Per-node or global color thresholds.
- Responsive desktop/mobile layout.
- Shadow DOM styling with glass, transparent, and solid background modes.

![Nexus Energy Card editor](images/nexus-energy-card-editor.png)

## HACS Installation

### Custom repository

1. In Home Assistant, open **HACS**.
2. Open the three-dot menu and choose **Custom repositories**.
3. Add your GitHub repository URL.
4. Select category **Dashboard**.
5. Click **Add**.
6. Install **Nexus Energy Card** from HACS.
7. Refresh the browser cache if Home Assistant does not load the new card immediately.

HACS calls dashboard cards "Dashboard" in the UI and "plugin" internally. This repository is configured as a HACS plugin.

### Repository requirements

For best HACS compatibility, keep the repository name as:

```text
nexus-energy-card
```

The built file is:

```text
dist/nexus-energy-card.js
```

The root `hacs.json` also declares:

```json
{
  "name": "Nexus Energy Card",
  "filename": "nexus-energy-card.js"
}
```

## Manual Installation

Build the card:

```bash
npm ci
npm run build
```

Copy the bundle into Home Assistant:

```text
dist/nexus-energy-card.js -> /config/www/nexus-energy-card.js
```

Add it as a dashboard resource:

```yaml
url: /local/nexus-energy-card.js
type: module
```

Then use the card:

```yaml
type: custom:nexus-energy-card
title: Nexus Energy
```

## Basic Configuration

The easiest way to configure the card is through the Home Assistant visual editor. The editor exposes:

- General settings: title, default mode, time selector, and main home entity.
- Tree builder: entity, display name, icon, parent node, direction, capacity, and invert value.
- Appearance: base flow width, animation speed, background style, zero-node hiding, and base color.
- Color thresholds: global or per-node warning colors above a configured power/energy value.

## YAML Example

```yaml
type: custom:nexus-energy-card
title: Nexus Energy
mode: power
range: today
show_time_selector: true
height: 720
default_expanded_depth: 2
animation: true
animation_speed: 1
line_width_base: 2
background_style: glass
hide_zero_nodes: false
base_color: "#38a5ff"
thresholds:
  warning: 0.65
  critical: 0.85
color_thresholds:
  - node_id: kitchen
    above: 2000
    color: "#ffb000"
sources:
  - id: solar
    name: Solar
    power_entity: sensor.solar_power
    energy_entity: sensor.solar_energy_today
    icon: mdi:white-balance-sunny
    capacity: 7
  - id: battery
    name: Battery
    power_entity: sensor.battery_power
    energy_entity: sensor.battery_energy_today
    icon: mdi:battery-charging-60
    capacity: 3
    direction: auto
    invert_value: false
  - id: grid
    name: Grid
    power_entity: sensor.grid_power
    energy_entity: sensor.grid_energy_today
    icon: mdi:transmission-tower
    capacity: 6
nodes:
  - id: home
    name: Home
    power_entity: sensor.home_power
    energy_entity: sensor.home_energy_today
    icon: mdi:home-outline
    capacity: 6
    children:
      - id: ground-floor
        name: Ground Floor
        power_entity: sensor.ground_floor_power
        energy_entity: sensor.ground_floor_energy_today
        icon: mdi:office-building-marker-outline
        capacity: 3.5
        children:
          - id: living-room
            name: Living Room
            power_entity: sensor.living_room_power
            energy_entity: sensor.living_room_energy_today
            icon: mdi:sofa-outline
          - id: kitchen
            name: Kitchen
            power_entity: sensor.kitchen_power
            energy_entity: sensor.kitchen_energy_today
            icon: mdi:pot-steam-outline
```

## Configuration Reference

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `Nexus Energy` | Card title. |
| `mode` | `power` or `energy` | `power` | Default display mode. |
| `range` | `today`, `yesterday`, `week`, `month`, `year`, `custom` | `today` | Energy range label. |
| `show_time_selector` | boolean | `true` | Shows the range selector in energy mode. |
| `height` | number | `720` | Preferred graph height. |
| `animation` | boolean | `true` | Enables moving particles in power mode. |
| `animation_speed` | number | `1` | Multiplier for particle speed. |
| `line_width_base` | number | `2` | Minimum flow width used by proportional paths. |
| `background_style` | `glass`, `transparent`, `solid` | `glass` | Card background treatment. |
| `hide_zero_nodes` | boolean | `false` | Hides zero-value sources/devices for a cleaner map. |
| `base_color` | color string | `#38a5ff` | Default flow and node accent color. |
| `default_expanded_depth` | number | `2` | Initial visible depth for hierarchy branches. |
| `thresholds.warning` | number | `0.65` | Warning ratio for capacity or parent share. |
| `thresholds.critical` | number | `0.85` | Critical ratio for capacity or parent share. |
| `color_thresholds` | array | `[]` | Per-node or global custom colors above a value. |
| `sources` | array | `[]` | Left-side source nodes: solar, battery, grid, generator. |
| `nodes` | array | `[]` | Main home node and nested child tree. |

### Node fields

| Key | Type | Description |
| --- | --- | --- |
| `id` | string | Stable node identifier. |
| `name` | string | Display name. |
| `entity` | string | Generic entity fallback. |
| `power_entity` | string | Power sensor, usually `device_class: power`. |
| `energy_entity` | string | Energy sensor, usually `device_class: energy`. |
| `icon` | string | Material Design icon, for example `mdi:home-outline`. |
| `capacity` | number | Optional capacity in kW/kWh for warning thresholds. |
| `direction` | `auto`, `import`, `export` | Flow direction behavior for sources/devices. |
| `invert_value` | boolean | Flips sign before direction is resolved. Useful for batteries/inverters. |
| `color` | color string | Optional node color. |
| `children` | array | Nested child nodes. |

### Color thresholds

`above` is interpreted as watts in power mode and as the current energy unit value in energy mode.

```yaml
color_thresholds:
  - node_id: "__all__"
    above: 2500
    color: "#ff6259"
  - node_id: kitchen
    above: 2000
    color: "#ffb000"
```

## Development

```bash
npm ci
npm run dev
npm run test
npm run build
```

Local demo:

```text
http://127.0.0.1:5173/
```

Local editor demo:

```text
http://127.0.0.1:5173/?editor=1
```

## Release Workflow

1. Update `package.json` and `CHANGELOG.md`.
2. Build locally:

   ```bash
   npm run check
   ```

3. Commit the generated `dist/nexus-energy-card.js`.
4. Create and push a version tag:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

5. The GitHub release workflow builds and attaches `dist/nexus-energy-card.js` to the release.

For inclusion in the default HACS store, also set a GitHub repository description, enable issues, add topics such as `home-assistant`, `hacs`, `lovelace`, `custom-card`, `energy`, `dashboard`, `typescript`, and make a full GitHub release.

## HACS Validation

This repository includes:

- `hacs.json`
- `.github/workflows/validate.yml`
- `.github/workflows/release.yml`
- `dist/nexus-energy-card.js`
- README images required by HACS plugin checks

The HACS validation workflow runs with:

```yaml
category: plugin
```

## License

MIT
