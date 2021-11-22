const fs = require('fs');
const pdf = require('pdf-parse');
const dataC = require('./Electron/DataController');
const DataController = new dataC();
let url="C:/Work/Workspace/Practica-Profesional---Control-de-Inventarios/Control-Inventarios/archivo.pdf";
let dataBuffer = fs.readFileSync(url);
 
pdf(dataBuffer).then(function(data) {
 
    console.log(data.numpages);
    console.log(data.info);
    DataController.analyze(data.text);
    //console.log(data.text); 
  
});