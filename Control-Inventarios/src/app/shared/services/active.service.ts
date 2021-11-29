import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
@Injectable({
  providedIn: 'root',
})
export class ActiveService {
  constructor() {}
  allActives() {
    electron.ipcRenderer.send('allActives');
  }
  allActiveByActive(idActive: number) {
    electron.ipcRenderer.send('activesById', idActive);
  }
  activesByIdActive(idActive: number) {
    electron.ipcRenderer.send('activesByIdActive', idActive);
  }
  view_loan(idActive: number) {
    electron.ipcRenderer.send('view_loan', idActive);
  }
  insertLoanActive(loan) {
    electron.ipcRenderer.send('insertLoanActive', loan);
  }
  updateStatusLoan(loan) {
    electron.ipcRenderer.send('updateStatusLoan', loan);
  }
  addActive(data) {
    electron.ipcRenderer.send('addActive', data);
  }
  editActive(active: ActiveModel) {
    electron.ipcRenderer.send('editActive', active);
  }
  editDistributionArea(data) {
    electron.ipcRenderer.send('editDistributionActive', data);
  }
  editLoanActive(active: ActiveModel) {
    electron.ipcRenderer.send('editLoanActive', active);
  }
  allActiveByArea(idArea: number) {
    electron.ipcRenderer.send('activesByArea', idArea);
  }
  allActiveByEdifice(id: number) {
    electron.ipcRenderer.send('activesByIdEdifice', id);
  }
  activesByloan(loan: any) {
    electron.ipcRenderer.send('activesByloan', loan);
  }
}
