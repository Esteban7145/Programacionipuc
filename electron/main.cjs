const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const Database = require('better-sqlite3');

let mainWindow;
let db;
let localServer;

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

  const rendererUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '..', 'dist', 'index.html')}`;

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

function startLocalServer() {
  return new Promise((resolve, reject) => {
    localServer = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', app: 'IPUC Vision' }));
        return;
      }

      if (req.url === '/api/songs') {
        const songs = db.prepare('SELECT * FROM songs ORDER BY created_at DESC').all();
        res.writeHead(200);
        res.end(JSON.stringify({ data: songs }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    });

    localServer.once('error', reject);
    localServer.listen(47821, '127.0.0.1', () => resolve({ port: 47821 }));
  });
}

app.whenReady().then(async () => {
  initDatabase();
  await startLocalServer();
  createWindow();

  ipcMain.handle('songs:list', () => db.prepare('SELECT * FROM songs ORDER BY created_at DESC').all());
  ipcMain.handle('app:server-status', () => ({ running: Boolean(localServer?.listening), port: 47821 }));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (localServer?.listening) {
    localServer.close();
  }
});
