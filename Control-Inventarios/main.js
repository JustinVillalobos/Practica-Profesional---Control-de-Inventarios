const electron = require('electron')
const {app, BrowserWindow,ipcMain, screen} = electron
const remote = require('electron').remote

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
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
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
ipcMain.on("edificio", (event) =>{
    event.reply("reply", "pong");
});
ipcMain.on("area", (event) =>{
    event.reply("reply", "pong");
});
ipcMain.on("activo", (event) =>{
    event.reply("reply", "pong");
});
 ipcMain.on('window-close',function(){
    console.log("comunicacion lograda");
  }) 