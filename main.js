import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1448,
    height: 768,
    minWidth: 1800,
    minHeight: 950,
    frame: true,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true, // Enable contextIsolation for security
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  // Handle window actions
  ipcMain.on("minimize", () => {
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
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
