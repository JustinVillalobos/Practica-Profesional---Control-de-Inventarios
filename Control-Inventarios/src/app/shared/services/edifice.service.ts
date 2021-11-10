import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
@Injectable({
  providedIn: 'root'
})
export class EdificeService {

  constructor() { }
    allEdifices() {
       electron.ipcRenderer.send("allEdifices");
    }
    allEdificesActives() {
       electron.ipcRenderer.send("allEdificesActive");
    }
    addEdifice(edifice:EdificeModel){
      electron.ipcRenderer.send("addEdifice",edifice);
    }
    editEdifice(edifice:EdificeModel){
      electron.ipcRenderer.send("editEdifice",edifice);
    }
    editStatusEdifice(edifice:EdificeModel){
      electron.ipcRenderer.send("editStatusEdifice",edifice);
    }
}
