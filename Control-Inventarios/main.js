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

    //appWin.webContents.openDevTools();

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
ipcMain.on("allEdifices", (event) =>{
     let res = edificeClass.allEdifices();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("allEdifices", {"res":true,"edifices":convertedResponse});
      }).catch(() => {
         event.reply("allEdifices", {"res":false});
      });
});
ipcMain.on("allEdificesActive", (event) =>{
     let res = edificeClass.allEdificesActive();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("allEdificesActive", {"res":true,"edifices":convertedResponse});
      }).catch(() => {
         event.reply("allEdificesActive", {"res":false});
      });
});

ipcMain.on("addEdifice", (event,data) =>{
    const validateName = validations.FormatoAlfaNumerico(data.name,125);
     if(validateName){
         let res = edificeClass.addEdifice(data);
        res.then(_data =>{
               event.reply("addEdifice", {"res":true});
          }).catch(() => {
            event.reply("addEdifice", {"res":false});
          });
      }else{
           event.reply("addEdifice", {"res":false});
      }
});
ipcMain.on("editEdifice", (event,data) =>{
     const validateName = validations.FormatoAlfaNumerico(data.name,125);
     const validateId = validations.FormatoNumerico(data.idEdifice);
     if(validateName && validateId){
         let res = edificeClass.editEdifice(data);
        res.then(_data =>{
                event.reply("editEdifice", {"res":true});
          }).catch(() => {
               event.reply("editEdifice", {"res":false});
          });
     }else{
           event.reply("editEdifice", {"res":false});
      }
});
ipcMain.on("editStatusEdifice", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idEdifice);
    if( validateId){
         let res = edificeClass.editStatusEdifice(data);
        res.then(_data =>{
                event.reply("editStatusEdifice", {"res":true});
          }).catch((err) => {
               event.reply("editStatusEdifice", {"res":false});
          });
    }else{
         event.reply("editStatusEdifice", {"res":false});
    }
});

/*EVENTS AREA*/
ipcMain.on("allAreas", (event) =>{
   let res = areaClass.allAreas();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("allAreas", {"res":true,"areas":convertedResponse});
      }).catch(() => {
         event.reply("allAreas", {"res":false});
      });
});
ipcMain.on("allAreasActives", (event) =>{
   let res = areaClass.allAreasActives();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("allAreasActives", {"res":true,"areas":convertedResponse});
      }).catch(() => {
         event.reply("allAreasActives", {"res":false});
      });
});

ipcMain.on("allAreasByEdifice", (event,data) =>{
     const validateId = validations.FormatoNumerico(data);
   if(validateId){
       let res = areaClass.allAreasByEdifice(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]));
                 event.reply("allAreasByEdifice", {"res":true,"areas":convertedResponse});
          }).catch((err) => {
             event.reply("allAreasByEdifice", {"res":false});
          });
   }else{
           event.reply("allAreasByEdifice", {"res":false});
      }
});
ipcMain.on("addArea", (event,data) =>{
    const validateName = validations.FormatoAlfaNumerico(data.name,125);
     const validateId = validations.FormatoNumerico(data.idEdifice);
   if(validateName && validateId){
       let res = areaClass.addArea(data);
        res.then(_data =>{
                 event.reply("addArea", {"res":true});
          }).catch(() => {
             event.reply("addArea", {"res":false});
          });
      }else{
           event.reply("addArea", {"res":false});
      }
});
ipcMain.on("editStatusArea", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idArea);
   if(validateId){
         let res = areaClass.editStatusArea(data);
        res.then(_data =>{
                event.reply("editStatusArea", {"res":true});
          }).catch(() => {
               event.reply("editStatusArea", {"res":false});
          });
    }else{
         event.reply("editStatusArea", {"res":false});
    }
});

ipcMain.on("editArea", (event,data) =>{
    const validateName = validations.FormatoAlfaNumerico(data.name,125);
     const validateId = validations.FormatoNumerico(data.edifice.idEdifice);
     const validateIdArea = validations.FormatoNumerico(data.idArea);
   if(validateName && validateId && validateIdArea){
       let res = areaClass.editArea(data);
        res.then(_data =>{
                event.reply("editArea", {"res":true});
          }).catch(() => {
            event.reply("editArea", {"res":false});
          });
      }else{
          event.reply("editArea", {"res":false});
      }
});

/*EVENTS ACTIVES*/
ipcMain.on("allActives", (event,data) =>{
     let res = activeClass.allActives();
    res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
             event.reply("allActives", {"res":true,"actives":convertedResponse});
      }).catch(() => {
         event.reply("allActives", {"res":false});
      });
});
ipcMain.on("activesByIdActive", (event,data) =>{
     const validateId = validations.FormatoNumerico(data);
    if(validateId){
        let res = activeClass.activesByIdActive(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("activesByIdActive", {"res":true,"actives":convertedResponse});
          }).catch((err) => {
             event.reply("activesByIdActive", {"res":false});
          });
      }else{
          event.reply("activesByIdActive", {"res":false});
      }
});
ipcMain.on("activesById", (event,data) =>{
     const validateId = validations.FormatoNumerico(data);
    if(validateId){
        let res = activeClass.activesById(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("activesById", {"res":true,"actives":convertedResponse});
          }).catch(() => {
             event.reply("activesById", {"res":false});
          });
      }else{
          event.reply("activesById", {"res":false});
      }
});
ipcMain.on("view_loan", (event,data) =>{
     const validateId = validations.FormatoNumerico(data);
    if(validateId){
        let res = activeClass.view_loan(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("view_loan", {"res":true,"actives":convertedResponse});
          }).catch(() => {
             event.reply("view_loan", {"res":false});
          });
      }else{
          event.reply("view_loan", {"res":false});
      }
});

ipcMain.on("activesByIdEdifice", (event,data) =>{
     const validateId = validations.FormatoNumerico(data);
    if(validateId){
        let res = activeClass.activesByIdEdifice(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("activesByIdEdifice", {"res":true,"actives":convertedResponse});
          }).catch(() => {
             event.reply("activesByIdEdifice", {"res":false});
          });
      }else{
          event.reply("activesByIdEdifice", {"res":false});
      }
});
ipcMain.on("activesByArea", (event,data) =>{
     const validateId = validations.FormatoNumerico(data);
    if(validateId){
        let res = activeClass.activesByIdArea(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("activesByArea", {"res":true,"actives":convertedResponse});
          }).catch(() => {
             event.reply("activesByArea", {"res":false});
          });
      }else{
          event.reply("activesByArea", {"res":false});
      }
});
ipcMain.on("activesByloan", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idActivo);
    if(validateId){
        let res = activeClass.activesById(data);
        res.then(_data =>{
                const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
                 event.reply("activesByloan", {"res":true,"actives":convertedResponse});
          }).catch(() => {
             event.reply("activesByloan", {"res":false});
          });
      }else{
          event.reply("activesByloan", {"res":false});
      }
});

ipcMain.on("editDistributionActive", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idActivo);
    if(validateId){
        let res2 =activeClass.sp_delete_distribution(data.idActive);
         res2.then(_data =>{
           let res = activeClass.editDistributionActive(data);
            res.then(_data =>{
                console.log("SUCCESS");
                     event.reply("editDistributionActive", {"res":true});
              }).catch((err) => {
                  console.log("ERR",err);
                 event.reply("editDistributionActive", {"res":false});
              });
          }).catch((err) => {
              console.log(err);
            event.reply("editDistributionActive", {"res":false});
          });
        
      }else{
          event.reply("editDistributionActive", {"res":false});
      }
});
function updateLoan(id,event,status){
    let res = activeClass.updateLoanActive(id,status);
        res.then(_data =>{
            console.log("Actualizo Estado");
          }).catch((err) => {
              console.log(err);
             event.reply("insertLoanActive", {"res":false});
          });
}
ipcMain.on("updateStatusLoan", (event,data) =>{
    let res = activeClass.updateLoanActive(data.idActive,false);
        res.then(_data =>{
            event.reply("updateStatusLoan", {"res":true});
          }).catch((err) => {
              console.log(err);
             event.reply("updateStatusLoan", {"res":false});
          });
});
ipcMain.on("insertLoanActive", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idActive);
    if(validateId){
        updateLoan(data.idActive,event,true);
        let res = activeClass.insertLoan(data);
        res.then(_data =>{
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))

              let res2 = activeClass.insertLoanActive({"idLoan":convertedResponse[0].idLoan,"idActive":data.idActive});
                  res2.then(_data =>{
                    event.reply("insertLoanActive", {"res":true});
                  }).catch(() => {
                     event.reply("insertLoanActive", {"res":false});
                  });
                 
          }).catch((err) => {
             event.reply("insertLoanActive", {"res":false});
          });
      }else{
          event.reply("insertLoanActive", {"res":false});
      }
});
ipcMain.on("editLoanActive", (event,data) =>{
     const validateId = validations.FormatoNumerico(data.idActivo);
    if(validateId){
        let res = activeClass.editStatusActive(data);
        res.then(_data =>{
                 event.reply("editLoanActive", {"res":true});
          }).catch(() => {
             event.reply("editLoanActive", {"res":false});
          });
      }else{
          event.reply("editLoanActive", {"res":false});
      }
});
ipcMain.on("addActive", (event,data) =>{
    let validateName = validations.FormatoAlfaNumerico(data.name,150);
    let validateLicensePlate = true;
    let validateMark= true;
    let validateModel = true;
    let validateSerie = true;
    let validateAmount = validations.FormatoNumerico(data.amount);
    if(data.licensePlate!=""){
        validateLicensePlate = validations.FormatoAlfaNumerico(data.licensePlate,100);
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
            const convertedResponse = JSON.parse(JSON.stringify(_data[0]))
            let id =convertedResponse[0].idActive;
               let res2 = activeClass.editDistributionActive({"idActive":id,"areas":data.areas});
                res2.then(_data =>{
                        event.reply("addActive", {"res":true});
                  }).catch(() => {
                     event.reply("addActive", {"res":false});
                  });
          }).catch((err) => {
              console.log(err);
             event.reply("addActive", {"res":false});
          });
          
   }else{
       event.reply("addActive", {"res":false});
   }
   
});
ipcMain.on("editActive", (event,data) =>{
     let validateName = validations.FormatoAlfaNumerico(data.name,150);
    let validateLicensePlate = true;
    let validateMark= true;
    let validateModel = true;
    let validateSerie = true;
    let validateAmount = validations.FormatoNumerico(data.amount);
    if(data.licensePlate!=""){
        validateLicensePlate = validations.FormatoAlfaNumerico(data.licensePlate,100);
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
                event.reply("editActive", {"res":true});
          }).catch((err) => {
              console.log(err);
             event.reply("editActive", {"res":false});
          });
   }else{
       event.reply("editActive", {"res":false});
   }
});
ipcMain.on("editStatusActive", (event,data) =>{  
     const validateStatus = data.status === true;
     const validateId = validations.FormatoNumerico(data.idActivo);
   if(validateStatus && validateId){
          let res = activeClass.editStatusActive(data);
    res.then(_data =>{
          event.reply("editStatusActive", {"res":true});
      }).catch(() => {
         event.reply("editStatusActive", {"res":false});
      });
    }else{
         event.reply("editStatusActive", {"res":false});
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
          }).catch((err) => {
              console.log(err);
           event.reply("reply", {"res":false});
          });
      }else{
          event.reply("reply", {"res":false});
      }
  }) ;
 