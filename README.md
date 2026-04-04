# WO Material Planner

A **fully offline Progressive Web App (PWA)** for planning and recording materials on Maximo work orders — designed for field technicians who don't have Maximo mobile access.

---

## Features

- ✅ Create and manage **multiple work orders**
- 📦 **Plan tab** — Add non-rotating items (item number, storeroom, planned quantity) and rotating items (item number, storeroom)
- 🔧 **Actual tab** — Record actual quantities used for non-rotating items and actual asset numbers issued for rotating items
- 📴 **100% offline** — works with no internet connection after first load
- 💾 All data saved locally on your device (localStorage) — never sent anywhere
- 📱 Install to your phone home screen like a native app

---

## File Structure

```
wo-planner/
├── index.html      ← The entire app (HTML + CSS + JavaScript)
├── manifest.json   ← PWA configuration
├── sw.js           ← Service worker (enables offline use)
├── icon.svg        ← App icon
└── README.md       ← This file
```

---

## Deploying to GitHub Pages

1. **Fork or upload** these files to a new GitHub repository
2. Go to your repository **Settings → Pages**
3. Under *Source*, select **Deploy from a branch**
4. Choose branch `main` and folder `/ (root)` → click **Save**
5. Your app will be live at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```

> Allow 1–2 minutes for GitHub Pages to deploy after saving.

---

## Installing on Your Phone

### iPhone / iPad (Safari)
1. Open the app URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with upward arrow at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right
5. The app icon will appear on your home screen

### Android (Chrome)
1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** (top right)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **"Add"** / **"Install"**
5. The app will appear on your home screen

> After installing, the app opens full-screen with no browser chrome — just like a native app. It works completely offline.

---

## How to Use

### Creating a Work Order
1. Tap the **+** button on the home screen
2. Enter the WO number (e.g. `WO-12345`) and an optional description
3. Tap **Create Work Order**

### Planning Materials (Plan Tab)
- Tap **+** to add an item
- Choose **Non-Rotating** (standard stock items) or **Rotating** (tracked assets)
- **Non-Rotating**: enter item number, storeroom, and planned quantity
- **Rotating**: enter item number and storeroom (asset number recorded later in Actuals)
- Tap **Add to Plan**

### Recording Actuals (Actual Tab)
- All planned items appear here automatically
- **Non-Rotating**: type the actual quantity used — a progress bar shows used vs planned
- **Rotating**: type each asset number issued and tap **Add** — tags build up as you enter multiple assets
- All entries save automatically as you type

### Deleting
- Tap the 🗑 icon in the top right of a work order to delete it
- Tap ✕ next to any planned item to remove it (this also clears its actuals)

---

## Data & Privacy

All data is stored in your browser's **localStorage** — it never leaves your device and is never transmitted to any server. Clearing your browser data or app storage will erase all saved work orders.

---

## Updating the App

When you push updates to GitHub, users will get the new version on their next visit (the service worker refreshes the cache). To force a cache refresh, bump the `CACHE` version string in `sw.js`:

```javascript
// sw.js — change 'wo-planner-v1' to 'wo-planner-v2' etc.
const CACHE = 'wo-planner-v2';
```

---

## License

Free to use, copy, and modify. No attribution required.
