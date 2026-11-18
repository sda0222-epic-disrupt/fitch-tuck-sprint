# Fitch × Tuck sprint: Leading Through the Fog

Static site for the Leading Through the Fog Checklist, hosted with GitHub Pages.

- `checklist/` is the interactive ten-practice quiz. Everything it needs is in that folder.
- `index.html` at the root just forwards visitors to `checklist/`.

## Editing the quiz

Open `checklist/index.html` and look for the `CONFIG` block near the top of the script:

- `clientLogo`: the partner logo file shown on the intro and results screens. Swap the PNG, or set it to `""` to hide it.
- `clientName`: the text shown next to the logo.
- `siteLive`: keep `false` until leadingthroughthefog.com has real content. While it is `false`, the quiz shows no links to the site.

The ten practices, their questions, and the "try this" nudges are in the `PRACTICES` list just below `CONFIG`.
Score cutoffs are in `LEVELS` (0–9 the fog thickens, 10–21 lessens, 22–40 clears).

## Tracking completions in a Google Sheet

`tracking/google-sheet-tracker.js` is a Google Apps Script. Paste it into a Google Sheet (Extensions → Apps Script), deploy it as a web app (Execute as: Me, Who has access: Anyone), and put the web app URL in `CONFIG.trackingUrl` in `checklist/index.html`.

Each run of the diagnostic then gets one anonymous row in the sheet's `Responses` tab: start time, questions completed, score out of 40, result, whether it was completed, and the last update time. While `trackingUrl` is empty, the quiz sends nothing.
