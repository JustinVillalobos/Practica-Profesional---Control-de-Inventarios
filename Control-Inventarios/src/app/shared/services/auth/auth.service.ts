import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
     
   }

   login(user: string, password: string) {
    
    }

  private setSession(auth) {
    localStorage.setItem('id_token', auth.idToken);
  }

  logout() {
    electron.ipcRenderer.send("window-close", "");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }
  public removeAllListeners(channel: string): void {
    
   electron.ipcRenderer.removeAllListeners(channel);
  }
}
