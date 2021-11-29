import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
const electron = (<any>window).require('electron');
import { EdificeService } from 'src/app/shared/services/edifice.service';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
@Component({
  selector: 'app-edit-edifice-modal',
  templateUrl: './edit-edifice-modal.component.html',
  styleUrls: ['./edit-edifice-modal.component.scss'],
})
export class EditEdificeModalComponent implements OnInit {
  edifice: EdificeModel = {
    idEdifice: 0,
    name: '',
  };
  isInvalidName: boolean = false;
  errorInputName: string = '';

  constructor(
    private dialog: MatDialog,
    private validation: ValidationsService,
    private spinner: NgxSpinnerService,
    private AlertService: AlertService,
    private EdificeService: EdificeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.edifice.idEdifice = this.data.idEdifice;
    this.edifice.name = this.data.name;
  }
  updateValue(e) {
    this.edifice.name = e.value;
  }
  save() {
    if (this.edifice.name == '') {
      this.isInvalidName = true;
      this.errorInputName = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.edifice.name,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.isInvalidName = true;
      this.errorInputName = 'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.edifice.name, 125)) {
      this.isInvalidName = true;
      this.errorInputName = 'El nombre es muy extenso';
    } else {
      this.isInvalidName = false;
    }

    if (!this.isInvalidName) {
      this.spinner.show();
      this.EdificeService.editEdifice(this.edifice);
      electron.ipcRenderer.on('editEdifice', (event: any, data: any) => {
        if (data['res']) {
          this.spinner.hide();
          this.AlertService.alertTimeCorrect(
            'Información guardada con éxito',
            function (_component) {
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
