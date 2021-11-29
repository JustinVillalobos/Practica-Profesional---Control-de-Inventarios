import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { ActiveService } from 'src/app/shared/services/active.service';
const electron = (<any>window).require('electron');
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-register-loan',
  templateUrl: './register-loan.component.html',
  styleUrls: ['./register-loan.component.scss'],
})
export class RegisterLoanComponent implements OnInit {
  name: string = '';
  date = new Date();
  idActive;
  isInvalidName: boolean = false;
  errorInputName: string = '';
  constructor(
    private dialog: MatDialog,
    private validation: ValidationsService,
    private AlertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ActiveService: ActiveService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.idActive = this.data.idActive;
    console.log(this.idActive);
  }
  updateValue(e) {
    this.name = e.value;
  }

  save() {
    if (this.name == '') {
      this.isInvalidName = true;
      this.errorInputName = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.name,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.isInvalidName = true;
      this.errorInputName = 'Solo se aceptan Carácteres Alfanúmerics';
    } else if (!this.validation.validateLength(this.name, 130)) {
      this.isInvalidName = true;
      this.errorInputName = 'El nombre es muy extenso';
    } else {
      this.isInvalidName = false;
    }

    if (!this.isInvalidName) {
      this.spinner.show();
      this.ActiveService.insertLoanActive({
        idActive: this.idActive,
        name: this.name,
        loanDate: this.date,
      });
      electron.ipcRenderer.on('insertLoanActive', (event: any, data: any) => {
        if (data['res']) {
          this.spinner.hide();
          this.AlertService.alertTimeCorrect(
            'Se ha generado un prestamo de un activo',
            function (_component) {
              _component.name = '';
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
