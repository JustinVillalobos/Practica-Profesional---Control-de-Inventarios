const electron = require('electron')
const {app, BrowserWindow,ipcMain, screen} = electron
const remote = require('electron').remote
const EncriptionClass = require('./Electron/secretKey');
const auth = require('./Electron/Auth');
const edifices = require('./Electron/EdificesController');
const edificeClass = new edifices();
const areas = require('./Electron/AreaController');
const areaClass = new areas();
const Actives = require('./Electron/ActiveController');
const activeClass = new Actives();
const Validations = require('./Electron/Validations');
const validations = new Validations();
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
    const validateName = validations.FormatoAlfaNumerico(data.name,50);
     if(validateName){
         let res = edificeClass.addEdifice(data);
        res.then(_data =>{
               event.reply("reply", {"res":true});
          }).catch(() => {
            event.reply("reply", {"res":false});
          });
      }else{
           event.reply("reply", {"res":false});
      }
});
ipcMain.on("editEdifice", (event,data) =>{
     const validateName = validations.FormatoAlfaNumerico(data.name,50);
     const validateId = validations.FormatoNumerico(data.idEdifice);
     if(validateName && validateId){
         let res = edificeClass.editEdifice(data);
        res.then(_data =>{
                event.reply("reply", {"res":true});
          }).catch(() => {
               event.reply("reply", {"res":false});
          });
     }else{
           event.reply("reply", {"res":false});
      }
});
ipcMain.on("editStatusEdifice", (event,data) =>{
    const validateStatus = data.status === true;
     const validateId = validations.FormatoNumerico(data.idEdifice);
    if(validateStatus && validateId){
         let res = edificeClass.editStatusEdifice(data);
        res.then(_data =>{
                event.reply("reply", {"res":true});
          }).catch(() => {
               event.reply("reply", {"res":false});
          });
    }else{
         event.reply("reply", {"res":false});
    }
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
     const validateId = validations.FormatoNumerico(data.idEdifice);
   if(validateId){
       let res = areaClass.allAreasByEdifice(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("reply", {"res":true,"areas":convertedResponse});
          }).catch(() => {
             event.reply("reply", {"res":false});
          });
   }else{
           event.reply("reply", {"res":false});
      }
});
ipcMain.on("addArea", (event,data) =>{
    const validateName = validations.FormatoAlfaNumerico(data.name,50);
     const validateId = validations.FormatoNumerico(data.idEdifice);
   if(validateName && validateId){
       let res = areaClass.addArea(data);
        res.then(_data =>{
                 event.reply("reply", {"res":true});
          }).catch(() => {
             event.reply("reply", {"res":false});
          });
      }else{
           event.reply("reply", {"res":false});
      }
});
ipcMain.on("editStatusArea", (event,data) =>{
    const validateStatus = data.status === true;
     const validateId = validations.FormatoNumerico(data.idArea);
   if(validateStatus && validateId){
         let res = areaClass.editStatusArea(data);
        res.then(_data =>{
                event.reply("reply", {"res":true});
          }).catch(() => {
               event.reply("reply", {"res":false});
          });
    }else{
         event.reply("reply", {"res":false});
    }
});

ipcMain.on("editArea", (event,data) =>{
    const validateName = validations.FormatoAlfaNumerico(data.name,50);
     const validateId = validations.FormatoNumerico(data.idEdifice);
     const validateIdArea = validations.FormatoNumerico(data.idArea);
   if(validateName && validateId && validateIdArea){
       let res = areaClass.editArea(data);
        res.then(_data =>{
                event.reply("reply", {"res":true});
          }).catch(() => {
            event.reply("reply", {"res":false});
          });
      }else{
          event.reply("reply", {"res":false});
      }
});

/*EVENTS ACTIVES*/
ipcMain.on("allActives", (event,data) =>{
     let res = activeClass.allActives();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("reply", {"res":true,"areas":convertedResponse});
      }).catch(() => {
         event.reply("reply", {"res":false});
      });
});
ipcMain.on("activesById", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idActivo);
    if(validateId){
        let res = activeClass.activesById(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("reply", {"res":true,"areas":convertedResponse});
          }).catch(() => {
             event.reply("reply", {"res":false});
          });
      }else{
          event.reply("reply", {"res":false});
      }
});
ipcMain.on("addActive", (event,data) =>{
    const validateName = validations.FormatoAlfaNumerico(data.name,50);
    const validateLicensePlate = true;
    const validateMark= true;
    const validateModel = true;
    const validateSerie = true;
    const validateAmount = validations.FormatoNumerico(data.amount);
    if(data.licensePlate!=""){
        validateLicensePlate = validations.FormatoAlfaNumerico(data.licensePlate,50);
    }
    if(data.mark!=""){
        validateMark = validations.FormatoAlfaNumerico(data.mark,50);
    }
    if(data.model!=""){
        validateModel = validations.FormatoAlfaNumerico(data.model,50);
    }
    if(data.serie!=""){
        validateSerie = validations.FormatoAlfaNumerico(data.serie,50);
    }
   if(validateName && validateLicensePlate && validateMark &&
       validateModel && validateSerie && validateAmount){
        let res = activeClass.addActive(data);
        res.then(_data =>{
                event.reply("reply", {"res":true});
          }).catch(() => {
             event.reply("reply", {"res":false});
          });
   }else{
       event.reply("reply", {"res":false});
   }
   
});
ipcMain.on("editActive", (event,data) =>{
     const validateName = validations.FormatoAlfaNumerico(data.name,50);
    const validateLicensePlate = true;
    const validateMark= true;
    const validateModel = true;
    const validateSerie = true;
    const validateAmount = validations.FormatoNumerico(data.amount);
    if(data.licensePlate!=""){
        validateLicensePlate = validations.FormatoAlfaNumerico(data.licensePlate,50);
    }
    if(data.mark!=""){
        validateMark = validations.FormatoAlfaNumerico(data.mark,50);
    }
    if(data.model!=""){
        validateModel = validations.FormatoAlfaNumerico(data.model,50);
    }
    if(data.serie!=""){
        validateSerie = validations.FormatoAlfaNumerico(data.serie,50);
    }
   if(validateName && validateLicensePlate && validateMark &&
       validateModel && validateSerie && validateAmount){
        let res = activeClass.editActive(data);
        res.then(_data =>{
                event.reply("reply", {"res":true});
          }).catch(() => {
             event.reply("reply", {"res":false});
          });
   }else{
       event.reply("reply", {"res":false});
   }
});
ipcMain.on("editStatusActive", (event,data) =>{  
     const validateStatus = data.status === true;
     const validateId = validations.FormatoNumerico(data.idActivo);
   if(validateStatus && validateId){
          let res = activeClass.editStatusActive(data);
    res.then(_data =>{
          event.reply("reply", {"res":true});
      }).catch(() => {
         event.reply("reply", {"res":false});
      });
    }else{
         event.reply("reply", {"res":false});
    }
});

/*EVENTS No groupby*/
 ipcMain.on('window-close',function(){
    console.log("comunicacion lograda");
 }); 

 /*EVENTS LOGIN*/
 ipcMain.on('login',function(event,data){
     const validateName = validations.FormatoAlfaNumerico(data.username,50);
     const validatePassword = validations.FormatoPSW(data.username,50);
      if(validateName && validatePassword){
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
      }else{
          event.reply("reply", {"res":false});
      }
  }) ;
 