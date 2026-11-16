# Wi-Fi Network Planner

An educational React/TypeScript/Konva prototype for EE 582.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Local URL printed by Vite. Production build: `npm.cmd run build`.
Signal-model checks: `node model-checks.mjs` (Node 22.18+ or newer).

## Features

- Office, open-workspace and blank presets
- Multiple draggable access points and client nodes, numeric position editing
- Wall drawing, endpoint editing, adjustable loss, delete and undo
- 2.4/5 GHz, shared AP transmit power, signal target and path-loss exponent
- Estimated strongest-AP links, coverage heatmap and client signal margins
- Browser-local autosave and JSON import/export

## Model

Received power = transmit power - FSPL at 1 m - 10*n*log10(max(distance,1 m)/1 m) - crossed-wall losses.
FSPL at 1 m uses frequency in Hz and c = 299792458 m/s. Antenna gains are fixed at 0 dBi. Each intersected wall segment contributes its specified loss. Wall loss is an explicit assumption and uses the same value at both bands; this is not a calibrated material database. Do not draw duplicate overlapping walls unless their losses should add.

Coverage means a modeled received-power threshold is met; it does not guarantee connectivity or throughput. AP association uses the strongest estimated signal. Interference, traffic, capacity, MAC behavior, fading, reflections, antenna patterns and roaming are not simulated. Validate real designs with measurements.

Course basis: Lecture 2 sections 2.1.1 and 2.4.1; Lecture 3 section 3.2.

## Data and deployment

Layouts stay in browser local storage unless exported. Imported JSON is validated before use. There is no server, account system or cloud database. Export layouts for reliable backups. This project has not been published. GitHub Pages build/deployment setup can be added later.
