import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
import { AreaModel } from 'src/app/shared/models/AreaModel';
@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor() { }
    allAreas() {
       electron.ipcRenderer.send("allAreas");
    }
     allAreasActives() {
       electron.ipcRenderer.send("allAreasActives");
    }
     allAreasByEdifice(idEdifice:number) {
       electron.ipcRenderer.send("allAreasByEdifice",idEdifice);
    }
    addArea(area:AreaModel){
      electron.ipcRenderer.send("addArea",area);
    }
    editArea(area:AreaModel){
      electron.ipcRenderer.send("editArea",area);
    }
    editStatusArea(area:AreaModel){
      electron.ipcRenderer.send("editStatusArea",area);
    }
}
