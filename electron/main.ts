import { release } from "os";
import path from "path";
import { BrowserWindow, app, ipcMain, shell } from "electron";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

if (release().startsWith("6.1")) app.disableHardwareAcceleration();

if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
let currentZoomFactor = 1; // Keep track of the zoom factor globally

const preload = path.join(__dirname, "preload.js");
const distPath = path.join(__dirname, "../.output/public");

async function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      zoomFactor: currentZoomFactor, // Initialize with tracked zoom factor
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(distPath, "index.html"));
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL!);
  }

  // Prevent zoom level changes during resize
  win.on("resize", () => {
    applyZoomFactor();
  });

  // Handle navigation events to ensure zoom is reapplied
  win.webContents.on("did-navigate", () => {
    console.log("Navigation detected, reapplying zoom");
    applyZoomFactor();
  });

  win.webContents.on("did-finish-load", () => {
    console.log("Content reloaded, reapplying zoom");
    applyZoomFactor();
  });

  // Disable pinch-to-zoom gestures
  win.webContents.setVisualZoomLevelLimits(1, 1);

  // Open external links in the user's default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

// Ensure zoom factor consistency across events
function applyZoomFactor() {
  if (win) {
    win.webContents.setZoomFactor(currentZoomFactor);
    console.log(`Zoom factor applied: ${currentZoomFactor}`);
  }
}

ipcMain.handle("electron-controls", (event, payload) => {
  switch (payload.action) {
    case "zoom-in":
      currentZoomFactor = Math.min(currentZoomFactor + 0.1, 3);

      applyZoomFactor();

      console.log(`Zoom changed: IN, New Zoom Factor: ${currentZoomFactor}`);

      break;
    case "zoom-out":
      currentZoomFactor = Math.max(currentZoomFactor - 0.1, 0.5);

      applyZoomFactor();

      console.log(`Zoom changed: OUT, New Zoom Factor: ${currentZoomFactor}`);

      break;
    case "zoom-reset":
      currentZoomFactor = 1;

      applyZoomFactor();

      console.log(`Zoom reset to default: 1`);

      break;
    case "zoom-set":
      // win?.webContents.setZoomFactor(+payload.zoomFactor || 1);

      currentZoomFactor = +payload.zoomFactor || 1;

      applyZoomFactor();

      console.log(`Zoom set to: ${currentZoomFactor}`);

      break;
  }
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) allWindows[0].focus();
  else createWindow();
});

app.commandLine.appendSwitch("force-device-scale-factor", "1");

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  createWindow();
});
