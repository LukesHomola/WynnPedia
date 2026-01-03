import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const correctedPath = path.join(__dirname, "preload.js");
console.log("Corrected path:", correctedPath);

let mainWindow;

function createWindow() {
  console.log("Resolved __dirname:", __dirname);
  console.log("Resolved preload.js path:", correctedPath);
  mainWindow = new BrowserWindow({
    minWidth: 1800,
    minHeight: 950,
    frame: true,
    autoHideMenuBar: false,
    webPreferences: {
      preload: correctedPath, // Use the manually corrected path
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Electron window loaded and preload.js is attached");
  });

  mainWindow.loadURL("http://localhost:3000");

  ipcMain.on("minimize", () => {
    console.log("Minimize event received");
    mainWindow.minimize();
  });

  ipcMain.on("maximize", () => {
    console.log("Maximize event received");
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close", () => {
    console.log("Close event received");
    mainWindow.close();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
