import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
@Injectable({
  providedIn: 'root'
})
export class BackupsService {

  constructor() { }
  backup(){
     electron.ipcRenderer.send("generate_backup");  
  }
}
