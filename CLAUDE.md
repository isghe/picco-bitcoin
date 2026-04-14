# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test    # runs xo linter (the only CI check)
```

No build step — this is a static site served directly (GitHub Pages).

## Architecture

**picco-bitcoin** is a Bitcoin price prediction game (#picco) that runs yearly. Participants estimate the minimum satoshi/€ rate during a 1-year window starting January 3rd. The closest estimate that doesn't exceed the actual minimum wins.

### Global Variable Architecture

The app uses plain vanilla JS with no modules. All state lives in globals loaded via `<script>` tags in `index.html` in this order:

1. `data/dataXX.js` → exposes `gData12`…`gData18` (one per edition)
2. `picco.js` → exposes `gPicco` (maps edition number → config + `minValue`)
3. `model.js` → exposes `gModel` (current edition selection, constants, reference to `gPicco`)
4. `index.js` → `ClassController` (URL parsing, table rendering, DOM construction)

### Data Flow

URL param `?picco=17` → `ClassController` reads `gModel.picco[edition]` → sorts `gDataXX` by `satoshi/€` descending → renders HTML table with penalty highlighting (red strikethrough for estimates that exceed `minValue`).

### Participant Data Format

Each `data/dataXX.js` file contains an array of objects:
```js
{ nome: 'name', 'satoshi/€': 1234, 'telegram-id': '@handle' }
// eliminated participant:
{ nome: 'name', 'satoshi/€': 1234, 'telegram-id': '@handle', penalità: 1 }
```

### Elimination Logic
A participant is marked as "lost" (CSS class `lost` on the `<tr>`)
when their `satoshi/€` value exceeds `model.picco[current.annoGenesi].minValue`.
The condition is evaluated in `matrixToTable()` via `infinityIfIsNaN()`;
the satoshi/€ column index is derived dynamically from the header array.

A participant is marked as "lost-absolute" when their `satoshi/€` value exceeds
the minimum `minValue` across all editions (currently picco17: 935.55872).

> ⚠️ The `penalità` property in data files does NOT determine elimination —
> it is just an accessory data field. Do not use it as a proxy for "lost" status.

### Adding a New Edition

1. Create `data/dataXX.js` with a new `gDataXX` global array
2. Add the edition config to `picco.js` (title, subTitle, favicon, minValue)
3. Add a favicon PNG to `favicons/`
4. Add a `<script>` tag for the new data file in `index.html`
5. Update `model.js` `defaultAnnoGenesi` to the new edition number

### Updating minValue

`minValue` in `picco.js` is updated manually (with a timestamp comment) whenever Bitcoin hits a new low during the active competition period. This determines who is eliminated.

## Code Style

The linter is `xo` (ESLint-based). Key non-default rules configured in `package.json`:
- `no-alert` disabled
- Various `unicorn/*` rules disabled (abbreviations, array-for-each, numeric-separators, typeof-undefined, prefer-module)
- `capitalized-comments` disabled
- Environments: browser + node
