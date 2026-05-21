# MaxPlan — WO Material Planner

An **offline-first Progressive Web App (PWA)** for Maximo users who don't have mobile access to Maximo. Plan and record materials for work orders directly from your phone — no internet connection needed after the first load.

---

## Installing on Your Phone

### iPhone / iPad (Safari only)
1. Open the app URL in **Safari**
2. Tap the **Share** button (box with arrow at the bottom)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**

### Android (Chrome)
1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** → **"Install App"** or **"Add to Home Screen"**
3. Tap **"Install"**

Once installed, the app opens full-screen with no browser chrome and works completely offline.

---

## Deploying to GitHub Pages

1. Upload all files to a GitHub repository
2. Go to **Settings → Pages → Source: Deploy from branch (main / root)**
3. After ~2 minutes your app is live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## How to Use

### Home Screen
- Tap **+** to create a new Work Order
- Work orders are grouped by status: **APPR → INPRG → COMP**
- Tap the version number button (top right of header) to view version history

### Plan Tab
- Tap **+** to add a planned item
- Choose **Non-Rotating** (standard stock items with quantity) or **Rotating** (tracked assets with quantity)
- Enter: Item Number, Storeroom, Planned Quantity
- Each item records a **reservation timestamp** (DD/MM/YYYY H:MM AM/PM)
- Items can inherit WO-level Location and Asset Number

### Actual Tab
- **Non-Rotating items**: add issue lines with Qty to Issue, Location, Asset Number, and Actual Date (auto-stamped)
- **Rotating items**: one slot per planned unit, each with Rotating Asset Number, Asset Number, Location, and Actual Date
- **↩ Returns to Storeroom** section (bottom of Actual tab): tap **+ New Return Row** to record any item returned — enter Item Number, Storeroom, Qty, Location, Asset Number, and Return Date

### Summary Tab
- Overview of planned vs actual per item, completion percentage, and per-slot detail
- Returns section shows all recorded returns
- **Copy Summary to Clipboard** button exports a formatted plain-text summary

---

## Updating the App

When a new version is published to GitHub, users will see a blue **Update** banner the next time they open the app while connected to the internet. Tapping it reloads to the latest version.

To publish a new version, update three things:
1. `APP_VER` constant in `index.html`
2. `version` field in `version.json`
3. `CACHE` constant in `sw.js`

---

## Data & Privacy

All data is saved in your browser's **localStorage** — it never leaves your device and is never sent to any server. Clearing browser data or app storage will erase saved work orders.

---

## Version History

### v1.4.6 — May Week 2 2026
- **Scanner buttons restored** — all barcode scan buttons throughout the app stopped working in v1.4.4. Root cause: adding the WO Location scan button routing accidentally deleted the `if (id && id.startsWith('__nr_')) {` guard, leaving duplicate `const` declarations as top-level code. In the IIFE's strict mode this caused a `SyntaxError` that prevented `window.openScanner` from ever being assigned — every scan button silently failed. Fixed by restoring the correct `if` guard. Validated with a JavaScript parser to confirm no syntax errors remain
- All v1.4.5 features retained

### v1.4.5 — May Week 2 2026
- **Update mechanism fully rebuilt** — the Update button now reliably applies new versions. Three root causes were fixed:
  - **Race condition** — the banner showed as soon as `version.json` was fetched, but the new SW may still be installing. Tapping Update while `_swWaiting` was null caused a fallback reload with the old SW still in control. Fix: `doUpdate()` calls `reg.update()` and waits up to 8 seconds for the new SW to reach the `installed` state before sending `SKIP_WAITING`
  - **sessionStorage not cleared** — `sessionStorage` persists across `location.reload()` in the same tab, blocking the version re-check after reload. Fix: `sessionStorage.removeItem('vchk')` is called before every reload (both in `controllerchange` and the fallback path)
  - **No update confirmation** — after reload there was no check that the update succeeded. Fix: `chkVer()` now explicitly hides the banner when `APP_VER` matches `version.json`
- Update button shows "Updating…" while waiting for the new SW to be ready
- All v1.4.4 features retained

### v1.4.4 — May Week 2 2026
- **Clipboard image fix (improved)** — images now reliably paste into email, Word, Outlook, and Notion. Fix uses `new Image()` + `onload` + double `requestAnimationFrame` to ensure every base64 image is fully decoded and painted before `execCommand('copy')` runs
- **Location scan button on New Work Order form** — the Location of Work field in the Create/Edit WO sheet now has a barcode scan button
- **Version history dates corrected** — all version entries updated to reflect actual GitHub upload dates (April Week 1–4 and May Week 1–2)
- All v1.4.3 features retained

### v1.4.3 — May Week 2 2026
- **Log image clipboard fix** — images now copy correctly. The previous `ClipboardItem` HTML blob approach failed because paste targets strip `<img src="data:...">` base64 tags. The fix renders a styled off-screen DOM element with real `<img>` elements, selects and copies it via `execCommand('copy')` — the browser copies the rendered bitmaps. Pasting into email, Word, Outlook, or Notion now includes the photos. Falls back to plain text if DOM-selection copy fails
- All v1.4.2 features retained

### v1.4.2 — May Week 2 2026
- **Barcode scan button on all location fields** — every location input now has a scan button: NR issue lines, rotating slots, NR return lines, standalone return rows, Move tab rows (Current & New Location), Quick Execute (Current & New Location), and both Mass Move fields
- **Quick Execute — locations stacked vertically** — Current Location and New Location are now one above the other (full width each) instead of side by side
- **Log images embedded in clipboard export** — uses `ClipboardItem` with `text/html` + `text/plain` when log entries have photos. Rich pasting into email/Word/Notion shows images inline at up to 200×200px. Plain-text fallback shows image count
- All v1.4.1 features retained

### v1.4.1 — May Week 2 2026
- **Auto-update root cause fixed** — `self.skipWaiting()` was being called automatically in the SW install event, forcing the new SW active immediately. Now removed from install — `skipWaiting()` is only called when the user explicitly taps **Update**. The app now stays on the current version until the user chooses to update
- **Log entries collapsible** — each entry shows a compact row (type, subject, timestamp, viewable dot, arrow). Tap to expand/collapse. New entries start expanded; tapping + New Log Entry auto-collapses all others
- **💾 Save and Minimise buttons** — Save shows a "✓ Saved" confirmation. Minimise collapses the entry. Data is always auto-saved on every keystroke regardless
- **📷 Photos in log entries** — Add photos to any log entry. Images are resized to ≤800px, shown as thumbnails, tappable for fullscreen. Photos appear in Summary tab
- **Viewable checkbox** — pre-ticked by default. Green/grey dot shown in collapsed row. Summary and export both state visibility clearly ("Viewable to service requester" / "Internal")
- All v1.4 features retained

### v1.4 — May Week 2 2026
- **Auto-update bug fixed** — the app no longer reloads automatically when a new version is detected. The `controllerchange` event now only triggers a reload when the user explicitly taps **Update** in the banner (`_updatePending` flag). Background SW installs are silent
- **📝 Log tab** added to every work order (between Actual and Summary). Tap **+ New Log Entry** to create an entry — the timestamp is captured immediately and is immutable
- Each log entry has a **Type** (Update / Work, colour-coded, defaulting to Update), a **Subject**, and a free-text **body** — both editable at any time after creation
- Log entries are listed newest-first and can be deleted individually
- Log entries appear in the Summary tab (📝 Work Log section) and in the clipboard export (WORK LOG section)
- All v1.3.7 features retained

### v1.3.7 — May Week 2 2026
- **Rotating asset placeholder updated** — all rotating asset number fields now show `e.g. A60001` (was A6001)
- **Plan tab field order redesigned** — the Add / Edit Planned Item form now follows the workflow order: **Storeroom** (mandatory) → **Bin** (optional) → **Item Number** + scanner (mandatory) → **Planned Quantity** (mandatory). Applies to both non-rotating and rotating items
- **Bin field removed from Actual tab** — the optional Bin field has been removed from non-rotating issue lines and rotating asset slots. Bin is now a Plan-only field recorded at planning time alongside the storeroom
- Bin continues to appear on plan item cards, in the Summary tab (as "Planned Bin"), and in the clipboard export
- All v1.3.6 features retained

### v1.3.6 — May Week 2 2026
- **Multi-scan panel — Confirm & Scan Next restored after X** — pressing ✕ during scanning returns to the confirmation panel with all three options: **Confirm & Scan Next** (or "Scan Another Asset" if no pending value), **Confirm & Finish**, and **Retry this scan**
- **Placeholder text updated** globally — Location fields: `e.g. HFA.ARC.ITC.1.114`, Bin fields: `e.g. C-02-05`, Rotating Asset fields: `e.g. A6001`
- **Scan Assets button** is now pill-shaped (matching + Add Row) with white text on green background
- **Optional Bin field in Plan tab** — both non-rotating and rotating plan items have a Bin field in Add / Edit form. Shown on the plan card, in the Summary tab, and in clipboard export as "Planned Bin"
- All v1.3.5 features retained

### v1.3.5 — May Week 2 2026
- **Optional Bin field** added to three workflows — issuing non-rotating items, issuing rotating items, and returning non-rotating items. Optional (no validation), appears after Asset Number / Return Date, included in Summary and clipboard export when filled
- **Move Tab – Quick Execute** — a new ⚡ Quick Execute panel at the top of the Move tab. Enter asset number (with scan), current location, and new location, then tap 💾 Save as Plan or ⚡ Execute Now. Buttons enable the moment both location fields are filled. No need to first click Add Row
- **Multi-scan X button fix** — pressing ✕ during a multi-asset scanning session no longer cancels the session and loses scanned assets. It returns to the confirmation panel instead. Assets are only committed or discarded when the user explicitly taps Confirm & Finish or Cancel. The Finish button shows how many rows will be created
- All v1.3.4 features retained

### v1.3.4 — May Week 1 2026
- **Execute Now button** is now dynamically enabled as you type — it activates the moment all three fields (Asset Number, Current Location, New Location) are filled. Card state updates in real time: Incomplete → ⏳ Planned → ✓ Executed
- **Asset Mass Move section** added at the bottom of the Move tab with two independent fields:
  - **📍 Set Current Location for all** — type a location and tap Apply to fill the Current Location on every non-executed row
  - **🏁 Set New Location for all** — type a location and tap Apply to fill the New Location on every non-executed row
- Each Apply button works independently — mass-set one field without touching the other
- Executed rows are never affected by mass apply — their data is locked at execution time
- A confirmation message shows how many rows were updated after each Apply
- All v1.3.3 features retained

### v1.3.3 — April Week 4 2026
- **PWA update fix** — the Update button now correctly applies new versions on all devices. Uses the `SKIP_WAITING` + `controllerchange` pattern: sends a message to the waiting service worker, waits for it to take control, then reloads — guaranteeing the new version is served
- **Multi-asset scan session** in the Move tab — tap **📷 Scan Assets** to scan several asset barcodes in one session. After each decode a confirmation panel shows the value and your running list with two options: **Confirm & Scan Next** or **Confirm & Finish**. Finishing creates one new move row per scanned asset, each pre-filled with the asset number
- **+ Add Row** button retained for manual entry alongside the scan button
- All v1.3.2 features retained

### v1.3.2 — April Week 4 2026
- **📲 How to Install button** added to the home screen — always visible at the bottom of the main page. Tapping it opens a step-by-step install guide with numbered steps and platform icons for both iPhone/iPad (Safari) and Android (Chrome)
- Install guide includes a Safari-only note for iOS users and a tip confirming the app works fully offline once installed
- **Move tab alignment fix** — Current Location and New Location fields are now reliably aligned on the same horizontal line on all devices including iOS Safari. Switched from CSS grid to flexbox with explicit identical input heights for consistent cross-platform rendering
- Clipboard export: asset movement rows separated by a blank line between entries for easier reading
- All v1.3 features retained

### v1.3.1 — April Week 4 2026
- Move tab: **Current Location** and **New Location** fields are now properly aligned on the same horizontal line — both labels and inputs sit flush at the same height
- Clipboard export: asset movement rows are now separated by a blank line between each entry, making the exported text much easier to read at a glance
- All v1.3 features retained

### v1.3 — April Week 3 2026
- New **🔀 Move tab** added as the first tab in every work order — before Plan, Actual, and Summary
- Each move row has: **Rotating Asset Number** (with barcode scan button), **Current Location**, and **New Location** shown side by side
- Rows can be **planned** (fields filled, no timestamp) or **executed** — tapping **⚡ Execute Now** stamps the exact date and time the move took place
- Executed rows lock permanently; the Execute button is replaced by a green confirmation stamp showing the exact time
- Adding a new row never affects existing rows' timestamps — each is independent
- Asset movements appear in the **Summary tab** in a 🔀 Asset Movements section, positioned after Work Order Details and before Issued Items
- Asset movements included in the **clipboard export** under an ASSET MOVEMENTS section
- All v1.2.15 features retained

### v1.2.15 — April Week 3 2026
- Barcode scan button added next to the **Item Number** field in each return row in the Actual tab — allows scanning the item number of the item being returned, consistent with the Plan tab
- **Long Description removed** from the Summary tab — it is no longer shown there
- **Summary tab layout clarified** — issued and returned items are now separated by clearly labelled colour-coded section dividers: a blue **⬆ Issued Items** banner and a red **↩ Returned Items** banner
- Section sub-labels simplified: **Non-Rotating** and **Rotating** under Issued Items; return count and total units under Returned Items
- All v1.2.14 features retained

### v1.2.14 — April Week 3 2026
- New return rows in the **↩ Returns to Storeroom** section now automatically pre-fill **Location** and **Asset Number** from the Work Order details (if set)
- This applies whether WO-level Location and Asset were set at creation time or added later via Edit Work Order — any new return row always picks up the current WO values at the moment it is created
- Pre-filled fields are visually marked **(from WO)** in purple, matching the inheritance styling used on issue lines throughout the app
- Fields remain fully editable — the WO values are a starting point, not a lock
- All v1.2.13 features retained

### v1.2.13 — April Week 3 2026
- **Version history button** in the home screen header now shows the current version number (`v1.2.13`) as text instead of the 📋 checklist icon
- **Standalone Returns section** — the Actual tab now has a dedicated **↩ Returns to Storeroom** section at the bottom, always visible regardless of what is planned
- Each return row accepts: Item Number, Storeroom, Qty to Return, Location, Asset Number (with barcode scan), and Return Date (auto-stamps on first qty entry)
- Returns are independent of planned items — any item number and storeroom can be entered freely
- Return rows highlight in red once item number and quantity are filled
- Returns summarised in the Summary tab and included in clipboard export
- All v1.2.12 features retained

### v1.2.12 — April Week 3 2026
- Returns for non-rotating items — each NR actual card has a ↩ Returns section with return lines (Qty to Return, Location, Asset Number with scan, Return Date). Net on-hand counter (Issued − Returned) updates live
- Torch / flash toggle (🔦) in scanner header during Live Mode on supported devices
- Version history button moved to home screen header (was bottom of scroll list)
- All v1.2.11 features retained

### v1.2.11 — April Week 3 2026
- Summary tab always visible with Work Order Details shown immediately, even before any items are planned
- "Started" renamed to "In Progress" in Summary tab and clipboard export
- Timestamp format changed to `DD/MM/YYYY H:MM AM/PM` throughout
- Version history button added to home screen header (top-right, 📋 icon)
- Clear Completed WOs button appears when at least one WO has COMP status
- All v1.2.10 features retained

### v1.2.10 — April Week 3 2026
- Beep on successful scan (Web Audio API, 1800Hz tone)
- Wider scan window (aspect ratio changed from 3.5:1 to 2.2:1)
- Scan button added to WO Asset field in WO creation/edit sheet
- Scan buttons on every issue line's Asset Number field (Non-Rotating Actual tab)
- Scan buttons on every rotating asset slot's Rotating Asset and Asset Number fields
- All v1.2.9 features retained

### v1.2.9 — April Week 3 2026
- Barcode scanner rebuilt using `@zxing/browser` (the correct dedicated browser layer — `@zxing/library` is deprecated for browser use)
- Live mode uses `decodeFromConstraints()`, photo mode uses `decodeFromImageElement()` — both from `BrowserMultiFormatReader`
- All v1.2.8 features retained

### v1.2.8 — April Week 2 2026
- Dual-mode scanner: Live video (default) + Photo capture fallback, switchable via toggle button
- Live mode uses horizontal crop loop (aspect ratio 3.5:1) matching the on-screen scan window
- Photo mode uses native camera + `decodeFromImageUrl()` across 4 rotations

### v1.2.7 — April Week 2 2026
- Fixed root cause of decode failure in v1.2.5/v1.2.6: replaced `decodeFromCanvas()` with `decodeFromImageUrl(blobURL)`
- Tries four rotations automatically (0°, 90°, 270°, 180°) for sideways barcodes

### v1.2.6 — April Week 2 2026
- Intermediate build — minor UI and library loading improvements; decode root cause not yet identified

### v1.2.5 — April Week 2 2026
- Replaced ZBar WASM with `@zxing/library@0.19.3` UMD loaded as a plain script tag
- `BrowserMultiFormatReader.decodeFromCanvas()` — tries four rotations automatically
- Library status indicator on scan screen shows when ZXing is ready

### v1.2.4 — April Week 2 2026
- Barcode decoder upgraded to ZBar WebAssembly
- Confirmation panel shows scanned value and format before pasting into Item Number field
- Auto-rotates image 90° and decodes again if photographed in portrait orientation

### v1.2.3 — April Week 2 2026
- Barcode scanner redesigned to use native camera app via file input (`capture="environment"`)
- After photo, app decodes using ZXing static image decoder
- Auto-rotates image if photographed sideways; confirmation panel before pasting result
- Supported formats: Code 128, Code 39, Code 93, EAN-13, EAN-8, UPC-A, UPC-E, QR Code, Data Matrix, Aztec, PDF-417, ITF and more

### v1.2.2 — April Week 2 2026
- Barcode scanner rebuilt using QuaggaJS — purpose-built mobile barcode library
- iOS compatibility: `numOfWorkers` set to 0 on iPhone/iPad (Safari WKWebView limitation)
- Requires 2 consistent reads before confirming — reduces false positives
- QuaggaJS cached by service worker; scanner works fully offline after first load

### v1.2.1 — April Week 2 2026
- Barcode scanner rebuilt as a pure JavaScript Code 128 decoder — zero external dependencies
- Scans 40 horizontal rows per frame; requires 2 consistent reads before confirming

### v1.2 — April Week 2 2026
- Code 128 barcode scanner button added next to Item Number field in the Plan tab
- Works for both non-rotating and rotating item types
- Full-screen camera view with targeting frame and animated scan line

### v1.1.6 — April Week 1 2026
- Location now appears above Asset in Work Details (previously Asset Number first)
- Field labels renamed: Asset Number → Asset, Location of Work → Location
- Asset field placeholder changed to `e.g. A58817`; Location placeholder to `Location of work`
- Home screen WO grouping order changed to Approved → In Progress → Completed

### v1.1.5 — April Week 1 2026
- Work order status simplified to APPR → INPRG → COMP
- APPR is default on creation; INPRG and COMP auto-stamp date & time when set
- All v1.1.2 features restored and merged with v1.1.3/v1.1.4 improvements

### v1.1.4 — April Week 1 2026
- Work order status system (Planned / In Progress / On Hold / Complete / Cancelled)
- Tappable WO number with ▾ triangle opens Edit Work Order sheet
- Status badge shown in WO header and on home screen cards; included in export

### v1.1.3 — April Week 1 2026
- WO-level Asset Number and Location of Work fields added
- Plan items added after WO-level values are set inherit those values in the Actual tab (highlighted in purple)
- Rotating Asset Number clearly differentiated from WO-level Asset Number

### v1.1.2 — April Week 1 2026
- New WO form: Work Order Number, Title, Long Description, optional Location field
- Status system (default APPR) with INPRG and COMP auto-stamping date & time
- Non-rotating Actual tab uses flexible issue lines (qty and location per line)
- Actual Date auto-stamps on every issue line (NR) and asset slot (rotating)

### v1.1 — April Week 1 2026
- Rotating items include planned quantity in the Plan tab
- Actual tab: individual slots per planned rotating qty (asset number + location per slot)
- Non-rotating actuals: per-unit location tracking and issued toggles
- Edit work order; Notes field; Summary tab; Export / copy to clipboard
- Reservation timestamps on all planned items
- In-app version history and automatic update check

### v1.0 — April Week 1 2026
Initial release — offline-first PWA for Maximo WO material planning.
- Create and manage multiple work orders
- Add non-rotating items (item number, storeroom, planned quantity) to a Plan tab
- Add rotating items (item number, storeroom) to a Plan tab
- Record actual quantities used for non-rotating items in an Actual tab
- Record issued asset numbers for rotating items in an Actual tab
- Fully offline via service worker; installable as a PWA
- All data saved locally on-device — nothing sent to any server
