import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
const electron = (<any>window).require('electron');
import { AreaService } from 'src/app/shared/services/area.service';
import { AreaModel } from 'src/app/shared/models/AreaModel';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
import { EdificeService } from 'src/app/shared/services/edifice.service';
@Component({
  selector: 'app-edit-area-modal',
  templateUrl: './edit-area-modal.component.html',
  styleUrls: ['./edit-area-modal.component.scss'],
})
export class EditAreaModalComponent implements OnInit {
  edificios: EdificeModel[] = [];
  edifice: EdificeModel = {
    idEdifice: 0,
    name: '',
  };
  area: AreaModel = {
    idArea: 0,
    name: '',
    edifice: this.edifice,
    isEnabled: true,
  };
  isInvalidName: boolean = false;
  errorInputName: string = '';
  isInvalidEdifice: boolean = false;
  errorInputEdifice: string = '';
  constructor(
    private dialog: MatDialog,
    private validation: ValidationsService,
    private AlertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private EdificeService: EdificeService,
    private AreaService: AreaService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.area.idArea = this.data.idArea;
    this.area.edifice.name = this.data.edifice;
    this.area.name = this.data.name;
    this.area.edifice.idEdifice = this.data.idEdifice;
    this.allEdificesActives();
  }
  updateValue(e) {
    if (e.name === 'name') {
      this.area.name = e.value;
    } else if (e.name === 'edifice') {
      this.area.edifice.name = e.value;
    }
  }
  allEdificesActives() {
    this.spinner.show();
    this.EdificeService.allEdificesActives();
    electron.ipcRenderer.on('allEdificesActive', (event: any, data: any) => {
      if (data['res']) {
        const edifices = data['edifices'].map(function (e) {
          var isTrueSet = e.isEnabled.toLowerCase() === 'true';
          return { idEdifice: e.idEdifice, name: e.name, isEnabled: isTrueSet };
        });
        let flag = false;
        this.edificios = edifices;
        this.edifice.name = this.area.edifice.name;
        for (let i = 0; i < this.edificios.length; i++) {
          if (this.edificios[i].name === this.area.edifice.name) {
            flag = true;
          }
        }
        if (!flag) {
          this.edificios.unshift(this.edifice);
        }
        this.spinner.hide();
      }
    });
  }
  saveArea() {
    if (this.area.name == '') {
      this.isInvalidName = true;
      this.errorInputName = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.area.name,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.isInvalidName = true;
      this.errorInputName = 'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.area.name, 125)) {
      this.isInvalidName = true;
      this.errorInputName = 'El nombre es muy extenso';
    } else {
      this.isInvalidName = false;
    }
    if (this.area.edifice.name == '') {
      this.isInvalidEdifice = true;
      this.errorInputEdifice = 'Campo Vacío';
    } else {
      this.isInvalidEdifice = false;
    }
    if (!this.isInvalidName && !this.isInvalidEdifice) {
      this.spinner.show();
      for (let i = 0; i < this.edificios.length; i++) {
        if (this.edificios[i].name === this.area.edifice.name) {
          this.area.edifice.idEdifice = this.edificios[i].idEdifice;
        }
      }
      this.AreaService.editArea(this.area);
      electron.ipcRenderer.on('editArea', (event: any, data: any) => {
        if (data['res']) {
          this.spinner.hide();
          this.AlertService.alertTimeCorrect(
            'Información guardada con éxito',
            function (_component) {
              _component.name = '';
              _component.edifice.name = '';
              _component.dialog.closeAll();
            },
            this
          );
        }
      });
    } else {
      return;
    }
  }
}
