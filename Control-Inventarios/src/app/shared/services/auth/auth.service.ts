import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(user: string, password: string) {
    electron.ipcRenderer.send('login', { username: user, password: password });
  }

  setSession(auth) {
    localStorage.setItem('idToken', auth['idToken']);
  }

  logout() {
    localStorage.removeItem('idToken');
  }
  public removeAllListeners(channel: string): void {
    electron.ipcRenderer.removeAllListeners(channel);
  }
}
