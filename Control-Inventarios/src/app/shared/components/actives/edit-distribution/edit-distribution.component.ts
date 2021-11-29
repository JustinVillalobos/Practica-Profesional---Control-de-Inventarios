import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { AreaService } from 'src/app/shared/services/area.service';
import { AreaModel } from 'src/app/shared/models/AreaModel';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
import { EdificeService } from 'src/app/shared/services/edifice.service';
import { ActiveService } from 'src/app/shared/services/active.service';
const electron = (<any>window).require('electron');
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-distribution',
  templateUrl: './edit-distribution.component.html',
  styleUrls: ['./edit-distribution.component.scss'],
})
export class EditDistributionComponent implements OnInit {
  idActive: number;
  amount: number;
  edifices = [];
  allAreas = [];
  areas = [];
  areaSelected = '';
  edificeSelected = '';
  amountArea = 1;
  amountT = 0;
  tempAreas = [];
  constructor(
    private dialog: MatDialog,
    private validation: ValidationsService,
    private AlertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private AreaService: AreaService,
    private EdificeService: EdificeService,
    private ActiveService: ActiveService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.idActive = this.data.idActive;
    this.amount = this.data.amount;
    this.areas = this.data.areas;
    this.amountT = this.amount;
    this.allEdifices();
    this.allAreasSelect();
  }
  allEdifices() {
    this.spinner.show();
    this.EdificeService.allEdificesActives();
    electron.ipcRenderer.on('allEdificesActive', (event: any, data: any) => {
      if (data['res']) {
        const edifices = data['edifices'].map(function (e) {
          var isTrueSet = e.isEnabled.toLowerCase() === 'true';
          return { idEdifice: e.idEdifice, name: e.name, isEnabled: isTrueSet };
        });
        this.edifices = edifices;
        this.edificeSelected = this.edifices[0].name;
        this.spinner.hide();
      }
    });
  }
  allAreasSelect() {
    this.AreaService.allAreasActives();
    electron.ipcRenderer.on('allAreasActives', (event: any, data: any) => {
      if (data['res']) {
        const areas = data['areas'].map(function (e) {
          var isTrueSet = e.isEnabled.toLowerCase() === 'true';
          let edifice = {
            idEdifice: e.idEdifice,
            name: e.edifice,
            isEnabled: true,
          };
          return {
            idArea: e.idArea,
            name: e.name,
            isEnabled: isTrueSet,
            edifice: edifice,
          };
        });
        this.tempAreas = areas;
      }
    });
  }
  updateValue(e) {
    if (e.name == 'amount') {
      if (this.amount > e.value) {
        this.areas = [];
      }
      this.amountArea = 1;
      this.amount = e.value;
    }
    if (e.name === 'amountArea') {
      this.amountArea = parseInt(e.value);
    }
  }
  updateEdifices(e) {
    this.edificeSelected = e.value;
    let idEdifice = 0;
    for (let i = 0; i < this.edifices.length; i++) {
      if (e.value == this.edifices[i].name) {
        idEdifice = this.edifices[i].idEdifice;
      }
    }
    this.AreaService.allAreasByEdifice(idEdifice);
    electron.ipcRenderer.on('allAreasByEdifice', (event: any, data: any) => {
      if (data['res']) {
        this.allAreas = data['areas'];
        let flag = true;
      }
    });
  }
  updateArea(e) {
    this.areaSelected = e.value;
  }
  getIdArea() {
    let countAmount = 0;
    for (let i = 0; i < this.allAreas.length; i++) {
      countAmount = countAmount + this.allAreas[i].amount;
      if (this.allAreas[i].name === this.areaSelected) {
        return this.allAreas[i].idArea;
      }
    }
  }
  saveDistribucion() {
    let countAmount = 0;
    let flag = true;
    let position = 0;
    if (this.areaSelected == '') {
      this.AlertService.alertaError('No has seleccionado ninguna área');
      return;
    }
    for (let i = 0; i < this.areas.length; i++) {
      countAmount = countAmount + this.areas[i].amount;
      if (this.areas[i].name === this.areaSelected) {
        position = i;
        flag = false;
      }
    }
    let idArea = this.getIdArea();
    countAmount = countAmount + this.amountArea;
    if (flag) {
      if (this.amount >= countAmount) {
        this.amountT = countAmount;
        this.areas.unshift({
          idArea: idArea,
          name: this.areaSelected,
          edifice: this.edificeSelected,
          amount: this.amountArea,
        });
      } else {
        this.AlertService.alertaError('Excede la cantidad total');
      }
    } else {
      if (this.amount >= countAmount) {
        this.amountT = countAmount;
        this.areas[position].amount =
          this.areas[position].amount + this.amountArea;
      } else {
        this.AlertService.alertaError('Excede la cantidad total');
      }
    }
  }
  remove(area) {
    this.areas = this.areas.filter((res) => {
      if (res.name == area) {
        this.amountT = this.amountT - res.amount;
      }
      return res.name !== area;
    });
  }
  setAreas() {
    for (let i = 0; i < this.tempAreas.length; i++) {
      for (let j = 0; j < this.areas.length; j++) {
        if (this.tempAreas[i].name == this.areas[j].name) {
          this.areas[j] = {
            edifice: this.areas[j].edifice,
            name: this.areas[j].name,
            amount: this.areas[j].amount,
            idArea: this.tempAreas[i].idArea,
          };
        }
      }
    }
  }
  getCountByArea() {
    let countAmount = 0;
    for (let i = 0; i < this.areas.length; i++) {
      countAmount = countAmount + this.areas[i].amount;
    }
    return countAmount;
  }
  save() {
    if (this.areaSelected == '') {
      this.AlertService.alertaError('No has seleccionado ninguna área');
      return;
    }
    if (this.amount == this.getCountByArea()) {
      this.setAreas();
      this.spinner.show();
      this.ActiveService.editDistributionArea({
        idActive: this.idActive,
        areas: this.areas,
      });
      electron.ipcRenderer.on(
        'editDistributionActive',
        (event: any, data: any) => {
          if (data['res']) {
            this.spinner.hide();
            this.AlertService.alertTimeCorrect(
              'Se ha generado una distribución del activo',
              function (_component) {
                _component.dialog.closeAll();
              },
              this
            );
          }
        }
      );
    } else {
      this.AlertService.alertaError('Faltan activos que distribuir');
    }
  }
}
