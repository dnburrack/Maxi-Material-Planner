# MaxPlan – WO Material Planner

A **fully offline Progressive Web App (PWA)** for planning and recording materials on Maximo work orders — designed for field technicians who don't have Maximo mobile access.

---

## Version History

### v1.1 — April Week 1, 2026
- Rotating items in the Plan tab now require a Planned Quantity field
- Actual tab now shows one individual line per planned rotating unit — each line accepts its own unique asset number and Maximo location
- Non-rotating items in the Actual tab now support Location Issues — issue the same item across multiple Maximo locations with individual quantities per location
- Remaining planned non-rotating quantities can be issued independently even when fewer items are used than planned
- Each issued rotating asset records its own unique Maximo location address
- Item number sample text updated to I27317; storeroom sample text updated to ST050
- Added Version History page, accessible via the version badge at the bottom of the home screen
- App automatically checks for a new published version on GitHub Pages once per session, and prompts the user to update if a newer version is detected

### v1.0 — April Week 1, 2026
Initial release. Core features: create and manage multiple Maximo work orders; plan non-rotating items (item number, storeroom, planned quantity) and rotating items (item number, storeroom); record actuals with actual quantities for non-rotating items and individual asset numbers for rotating items; fully offline via PWA service worker; installable to phone home screen.

---

## File Structure

```
maxplan/
├── index.html      ← Entire app (HTML + CSS + JS)
├── manifest.json   ← PWA configuration
├── sw.js           ← Service worker (offline caching + update detection)
├── version.json    ← Current version number — update this with each release
├── icon.svg        ← App icon
└── README.md       ← This file
```

---

## Deploying to GitHub Pages

1. Upload all files to a new GitHub repository
2. Go to **Settings → Pages**
3. Under *Source*, select **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**
4. Your app will be live at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```

---

## Installing on Your Phone

### iPhone / iPad (Safari only)
1. Open the app URL in **Safari**
2. Tap the **Share** button (box with arrow at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

### Android (Chrome)
1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** → **"Add to Home Screen"** or **"Install App"**
3. Tap **"Install"**

---

## How to Use

### Creating a Work Order
1. Tap **+** on the home screen
2. Enter the WO number (e.g. `WO-12345`) and an optional description
3. Tap **Create Work Order**

### Plan Tab — Planning Materials
Tap **+** to add items. Choose the type:

**Non-Rotating items:**
- Enter item number, storeroom, and planned quantity

**Rotating items:**
- Enter item number, storeroom, and planned quantity
- Each unit will get its own row in the Actual tab for individual asset tracking

### Actual Tab — Recording What Was Used

**Non-Rotating items:**
- Enter the total actual quantity used (progress bar shows vs planned)
- Tap **+ Add Location** to record which Maximo locations items were issued to
- Each location issue line has its own quantity and location field
- You can issue remaining quantities to additional locations even if actual qty < planned

**Rotating items:**
- Each planned unit has its own row: **Asset Number** + **Maximo Location**
- Enter the specific asset number issued and the location it was installed/issued to

### Deleting Items
- Tap 🗑 in the work order header to delete the whole work order
- Tap ✕ next to any planned item to remove it and its actuals

---

## Releasing a New Version

When you publish an update to GitHub Pages:

1. Make your code changes in `index.html`
2. Update the `APP_VERSION` constant in `index.html`:
   ```javascript
   const APP_VERSION = '1.2'; // bump this
   ```
3. Update `version.json` to match:
   ```json
   { "version": "1.2", "date": "May Week 2, 2026" }
   ```
4. Bump the `CACHE` string in `sw.js` to force a cache refresh:
   ```javascript
   const CACHE = 'maxplan-v1.2'; // bump this
   ```
5. Add the new version to the `VER_HISTORY` array in `index.html`
6. Commit and push all files

**How users get the update:**
- When a user opens the app, the service worker automatically checks for updates in the background
- `version.json` is always fetched fresh from the network (never served from cache)
- If a new version is detected, a green banner appears at the top of the home screen
- The user taps **"Update now"** and the app reloads with the new version

---

## Data & Privacy

All data is stored in the device's **localStorage** — it never leaves the device and is never sent anywhere. Clearing browser/app storage will erase saved work orders.
