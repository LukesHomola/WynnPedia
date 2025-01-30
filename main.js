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
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true, // Enable contextIsolation for security
    },
  });

  // Check if preload.js is loaded by the main process
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Electron window loaded and preload.js is attached");
  });

  mainWindow.loadURL("http://localhost:3000");

  // Handle window actions
  /*   ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close", () => {
    mainWindow.close();
  }); */

  // Log when minimize event is received
  ipcMain.on("minimize", () => {
    console.log("Minimize event received");
    mainWindow.minimize();
  });

  // Log when maximize event is received
  ipcMain.on("maximize", () => {
    console.log("Maximize event received");
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  // Log when close event is received
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
