const electron = require('electron')
const {app, BrowserWindow, screen} = electron

let appWin;

createWindow = () => {
    const {
      width,
      height
   } = screen.getPrimaryDisplay().workAreaSize
    appWin = new BrowserWindow({
        width: width,
        height: height,
        title: "Angular and Electron",
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    appWin.maximize();
    
    appWin.loadURL(`file://${__dirname}/dist/index.html`);

    appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});