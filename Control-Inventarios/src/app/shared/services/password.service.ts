import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor() { }

  validateUser(data){
     electron.ipcRenderer.send("validateUser",data);  
  }
  changePassword(data){
     electron.ipcRenderer.send("editPassword",data);  
  }
  changeData(data){
    electron.ipcRenderer.send("editUser",data);   
  }
  userData(data){
    electron.ipcRenderer.send("userInfo",data);   
  }
}
