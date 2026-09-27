/**
 * A9 OPTIMIZER - Electron Main Process
 * 
 * This file is the entry point for the Electron application.
 * It creates the main window, sets up IPC handlers, and manages
 * the application lifecycle.
 * 
 * Security:
 * - contextIsolation: true
 * - nodeIntegration: false
 * - sandbox: true (where practical)
 * - CSP enforced
 * - No eval or remote code execution
 */

import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } from 'electron';
import * as path from 'path';
import { registerIpcHandlers } from './ipc/handlers';
import { createTrayMenu } from './services/tray';
import { initLogger } from './services/logger';
import { initDatabase } from './services/database';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    title: 'A9 OPTIMIZER',
    icon: path.join(__dirname, '../assets/icon.ico'),
    backgroundColor: '#0a0e17',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, '../preload/index.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.deepseek.com https://api.grok.com https://api.groq.com https://openrouter.ai"
        ],
      },
    });
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', (event) => {
    // Minimize to tray instead of closing
    if (tray && !app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  // Initialize services
  initLogger();
  await initDatabase();

  // Register IPC handlers
  registerIpcHandlers(ipcMain);

  // Create window
  createWindow();

  // Create tray
  // tray = new Tray(path.join(__dirname, '../assets/tray-icon.png'));
  // tray.setToolTip('A9 OPTIMIZER');
  // tray.setContextMenu(createTrayMenu(mainWindow));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

// Declare app extension for quit tracking
declare module 'electron' {
  interface App {
    isQuitting: boolean;
  }
}

app.isQuitting = false;
app.on('before-quit', () => {
  app.isQuitting = true;
});
