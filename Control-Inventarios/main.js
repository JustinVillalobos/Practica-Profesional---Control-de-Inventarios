const electron = require('electron')
const {app, BrowserWindow,ipcMain, screen} = electron
const remote = require('electron').remote
const EncriptionClass = require('./Electron/secretKey');
const auth = require('./Electron/Auth');
const edifices = require('./Electron/EdificesController');
const edificeClass = new edifices();
const areas = require('./Electron/AreaController');
const areaClass = new areas();
const jwt = require('jsonwebtoken');

const SECRET = require("./Electron/key");
const JWT_Secret = SECRET.environment();
const AuthClass = new auth();
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

/*EVENTS EDIFICES*/
ipcMain.on("allEdificio", (event) =>{
     let res = edificeClass.allEdifices();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("reply", {"res":true,"areas":convertedResponse});
      }).catch(() => {
         event.reply("reply", {"res":false});
      });
});

ipcMain.on("addEdifice", (event,data) =>{
     let res = edificeClass.addEdifice(data);
    res.then(_data =>{
           event.reply("reply", {"res":true});
      }).catch(() => {
        event.reply("reply", {"res":false});
      });
});
ipcMain.on("editEdifice", (event,data) =>{
     let res = edificeClass.editEdifice(data);
    res.then(_data =>{
            event.reply("reply", {"res":true});
      }).catch(() => {
           event.reply("reply", {"res":false});
      });
});
ipcMain.on("editStatusEdifice", (event,data) =>{
     let res = edificeClass.editStatusEdifice(data);
    res.then(_data =>{
            event.reply("reply", {"res":true});
      }).catch(() => {
           event.reply("reply", {"res":false});
      });
});

/*EVENTS AREA*/
ipcMain.on("allAreas", (event) =>{
   let res = areaClass.allAreas();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("reply", {"res":true,"areas":convertedResponse});
      }).catch(() => {
         event.reply("reply", {"res":false});
      });
});
ipcMain.on("allAreasByEdifice", (event,data) =>{
   let res = areaClass.allAreasByEdifice(data);
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("reply", {"res":true,"areas":convertedResponse});
      }).catch(() => {
         event.reply("reply", {"res":false});
      });
});
ipcMain.on("addArea", (event,data) =>{
   let res = areaClass.addArea(data);
    res.then(_data =>{
             event.reply("reply", {"res":true});
      }).catch(() => {
         event.reply("reply", {"res":false});
      });
});
ipcMain.on("editStatusArea", (event,data) =>{
   let res = areaClass.editStatusArea(data);
    res.then(_data =>{
            event.reply("reply", {"res":true});
      }).catch(() => {
        event.reply("reply", {"res":false});
      });
});

ipcMain.on("editArea", (event,data) =>{
   let res = areaClass.editArea(data);
    res.then(_data =>{
            //const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
            console.log("RES edit",_data);
      }).catch(() => {
        console.log('Algo salió mal en edifices');
      });
});

/*EVENTS ACTIVES*/
ipcMain.on("activo", (event) =>{
    event.reply("reply", "pong");
});

/*EVENTS No groupby*/
 ipcMain.on('window-close',function(){
    console.log("comunicacion lograda");
 }); 

 /*EVENTS LOGIN*/
 ipcMain.on('login',function(event,data){
      let res = AuthClass.session(data.username,data.password);
      res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             if(convertedResponse.length!=0){
                  let usuario={
                      "idUser":convertedResponse[0].idUser
                      };
                  var token = jwt.sign({
                          exp: Math.floor(Date.now() / 1000) + (60 * 15),
                          data:usuario}, JWT_Secret);
                event.reply("reply", {"res":true,"idToken":token});
            }else{
                event.reply("reply", {"res":false});
            }
      }).catch(() => {
       event.reply("reply", {"res":false});
      });
  }) ;
 