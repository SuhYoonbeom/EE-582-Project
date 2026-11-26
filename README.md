# Wi-Fi Network Planner

**[Open the live website](https://suhyoonbeom.github.io/EE-582-Project/)**

An educational Wi-Fi planning prototype by **Matthew Suh** for **EE 582: Wireless Networking**. The website helps network designers and engineers compare access point placement and estimate downlink signal coverage in a 2D layout. AI assisted the development of the application.

## Features

- Office, open workspace, and blank layouts with editable dimensions.
- Multiple draggable access points (APs) and client nodes.
- Custom walls with editable endpoints and assumed loss in dB.
- 2.4 GHz or 5 GHz, adjustable transmit power, signal target, and path-loss exponent.
- Coverage heatmap and strongest-AP links for each client.
- Client results showing signal in dBm, margin in dB, and coverage status.
- Client signal calculation showing the strongest AP, distance, separate path-loss terms, crossed-wall losses, received power, and margin.
- Reset to the default office and radio settings, with confirmation and Undo.
- Browser-local autosave and JSON import/export.

## How to use it

1. **Choose a layout.** Select a preset and set dimensions in meters. A preset replaces the current layout; Undo can restore it.
2. **Place nodes.** Choose Access point or Client, then click the layout. Use Select to drag a node or edit its coordinates in the sidebar.
3. **Add walls.** Set New wall loss, choose Wall, and click the start and end points. Select a wall to drag its endpoint handles or edit its loss in the sidebar.
4. **Delete objects.** Choose Select, click a wall or node, and use the sidebar's delete button. Undo restores recent layout changes.
5. **Set radio parameters.** Choose frequency, AP transmit power, signal target, and path-loss exponent. These settings apply to every AP.
6. **Compare coverage.** Move an AP or change a parameter and review the heatmap and client table. Toggle Heatmap or Links to simplify the display.
7. **Save a copy.** Export layout downloads a JSON file. Import layout restores an exported design.

Frequency and transmit power are separate settings: frequency selects the band, while transmit power controls the assumed AP output power. A higher path-loss exponent makes the signal decrease faster with distance.

Select a client in the coverage table or in **Client signal calculation** to inspect its link budget. The breakdown updates when the layout or radio settings change. Distances below 1 m use 1 m in the model.

**Reset to default** restores the office layout and radio defaults after confirmation. Undo restores the previous layout and radio settings during the current session. Export first if you need a lasting backup.

## Example demonstration

Load the office preset and note a client's signal. Change from 2.4 GHz to 5 GHz while keeping the other settings fixed, then compare its signal again. Move an AP closer to a client or add a wall across its signal path to see how the estimate changes. Export each layout to keep multiple designs.

### Draft 3 placement comparison

Import `examples/draft3-baseline.json` and `examples/draft3-revised.json` in turn. Both use the same 30 × 20 m office, six clients, walls, 2.4 GHz, 20 dBm, exponent 2.6, and a -67 dBm target. Only AP coordinates change.

| Metric | Baseline | Revised |
| --- | --- | --- |
| AP 1 position (m) | (1, 1) | (5, 5) |
| AP 2 position (m) | (3, 1) | (24, 14) |
| Clients meeting target | 5 of 6 | 6 of 6 |
| Weakest client signal | -68.01 dBm | -51.11 dBm |
| Minimum client margin | -1.01 dB | 15.89 dB |

These are modeled results for two manually chosen designs, not measurements or proof of optimal placement. Some individual clients can have lower signal after redistribution even when minimum coverage improves.

## Signal model

The application uses a simplified log-distance model with additional wall losses:

```text
Received power (dBm) = transmit power (dBm)
                    - free-space path loss at 1 m (dB)
                    - 10 * n * log10(max(distance, 1 m) / 1 m)
                    - sum of crossed-wall losses (dB)

Free-space path loss at 1 m = 20 * log10(4 * pi * frequency_Hz * 1 m / c)
c = 299792458 m/s
```

Here, `n` is the adjustable path-loss exponent. Distances below 1 m use the 1 m reference value. Antenna gains are fixed at 0 dBi. Each intersected wall segment contributes its assigned loss, so overlapping walls can add multiple losses.

The model evaluates every AP for each client and selects the highest estimated received power. **Margin = estimated signal - signal target.** A client meets the target when its margin is zero or positive. The heatmap shows the strongest estimated received power at sampled locations.

### Assumptions and limitations

- Wall losses are editable assumptions, not calibrated material measurements. The same wall loss applies at both frequency bands.
- Radio settings are shared across APs. Separate per-AP settings and mixed-band deployments are not modeled.
- Strongest-AP links are design suggestions, not a simulation of Wi-Fi association or roaming.
- Interference, channel contention, traffic, capacity, throughput, fading, reflections, and antenna patterns are not simulated.
- Meeting the signal target does not guarantee connectivity or a particular data rate. Validate real designs with site measurements.

## Course connections

- **Lecture 2: Wireless Transmission Fundamentals**, sections 2.1.1 and 2.4.1: propagation, path loss, and link budgets.
- **Lecture 3: Wireless LAN Technologies**, section 3.2: WLAN architecture, access points, and clients.

## Run locally

Use Node.js 24 LTS, matching the deployment workflow. In the repository folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the Local URL printed by Vite. On macOS or Linux, use `npm` instead of `npm.cmd`.

To check the signal model and build the website:

```powershell
node model-checks.mjs
npm.cmd run build
```

The model checks exercise signal calculations, wall loss, and strongest-AP selection. The production build writes to `dist/`.

## Technology and deployment

The application uses React, TypeScript, Vite, and Konva with React Konva for the interactive canvas. GitHub Pages hosts the static website.

The workflow in `.github/workflows/deploy.yml` installs dependencies, runs the model checks, builds the website, and publishes `dist/` whenever changes reach `main`. Repository Settings > Pages uses **GitHub Actions** as its source. The production base path is `/EE-582-Project/`; local development uses the root URL printed by Vite.

To update the public site, edit the source, check changes locally, then commit and push to `main`. Wait for the deployment workflow to finish successfully.

## Data storage

Layouts and radio settings save in this browser's local storage. They do not automatically transfer between devices or browsers, and clearing browser data can remove them. Use JSON export for backups or sharing. Imported JSON is validated before use.

There is no account system, backend, or cloud layout database. Sharing the website URL opens the application; it does not share your saved layout.
