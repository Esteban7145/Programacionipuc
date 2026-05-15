const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#020617',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const rendererUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : `file://${path.join(__dirname, '..', 'dist', 'index.html')}`;
  mainWindow.loadURL(rendererUrl);
}

function initDatabase() {
  const dataDir = app.getPath('userData');
  db = new Database(path.join(dataDir, 'ipuc-vision.db'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  ipcMain.handle('songs:list', () => db.prepare('SELECT * FROM songs ORDER BY created_at DESC').all());
});
