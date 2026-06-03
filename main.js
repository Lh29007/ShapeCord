const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Optimisations mémoire raisonnables
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=384');
app.commandLine.appendSwitch('renderer-process-limit', '1');
app.commandLine.appendSwitch('disable-gpu'); // OK
app.commandLine.appendSwitch('disable-extensions');
app.commandLine.appendSwitch('disable-background-networking');
app.commandLine.appendSwitch('disable-breakpad');

// IMPORTANT : surtout pas de disable-gpu-compositing
// app.commandLine.appendSwitch('disable-gpu-compositing');

// Empêche plusieurs instances
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    backgroundColor: '#202225',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,          // IMPORTANT : Discord ne fonctionne pas sinon
      webSecurity: false       // Permet les assets CDN
    }
  });

  win.removeMenu();

  // Empêche devtools
  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools();
  });

  const url = 'https://discord.com/app';
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

  win.loadURL(url, { userAgent });

  // On bloque seulement les vidéos (gros poids)
  const ses = win.webContents.session;
  ses.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
    if (details.resourceType === 'media') {
      return callback({ cancel: true });
    }
    return callback({});
  });

  // Si Discord refuse de charger
  win.webContents.on('did-fail-load', () => {
    shell.openExternal(url);
  });
}

app.on('ready', () => {
  try { app.disableHardwareAcceleration(); } catch (e) {}
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
