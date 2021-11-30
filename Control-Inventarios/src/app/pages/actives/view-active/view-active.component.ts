import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
const electron = (<any>window).require('electron');
import { EditDistributionComponent } from 'src/app/shared/components/actives/edit-distribution/edit-distribution.component';
import { RegisterLoanComponent } from 'src/app/shared/components/actives/register-loan/register-loan.component';
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
import { LoanModel } from 'src/app/shared/models/LoanModel';
import { ActiveService } from 'src/app/shared/services/active.service';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';
@Component({
  selector: 'app-view-active',
  templateUrl: './view-active.component.html',
  styleUrls: ['./view-active.component.scss'],
})
export class ViewActiveComponent implements OnInit, OnDestroy {
  /*Declare and Init Variables*/
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  @ViewChild('SelectStatus', { static: false })
  SelectStatus: InputFormComponent;
  loan: LoanModel = {
    idLoan: 0,
    name: '',
    loanDate: new Date(),
  };
  active: ActiveModel = {
    idActive: 1,
    name: '',
    licensePlate: '',
    amount: 1,
    description: '',
    placeOrigin: '',
    mark: '',
    model: '',
    serie: '',
    isLoan: 0,
    loan: this.loan,
  };
  ContDescrip: string = '';
  areas = [];
  stateLoanTemp = 0;
  isLoan = false;
  count = 0;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private _router: Router,
    private _ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private ActiveService: ActiveService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.active.idActive = parseInt(
      this.router.snapshot.paramMap.get('idActive')
    );

    this.view();
  }
  /*Método de carga de los datos del Activo a visualizar*/
  view() {
    this.ActiveService.allActiveByActive(this.active.idActive);
    electron.ipcRenderer.on('activesById', (event: any, data: any) => {
      if (data['res']) {
        this.active = data['DATA'][1]['Active'][0];
        this.areas = data['DATA'][0]['Areas'];
        this.loan = data['DATA'][2]['Loan'][0];
        this.active.loan = this.loan;
        this.ContDescrip = this.active.description.replace(/\n/g, '<br />');
        if (this.active.isLoan == 1) {
          this.SelectStatus.setText('En Préstamo');
          this.isLoan = true;
          this.spinner.hide();
        } else if (this.active.isLoan == 0) {
          this.SelectStatus.setText('Disponible');
          this.isLoan = false;
          this.spinner.hide();
        } else {
          this.SelectStatus.setText('Proceso Desecho');
          this.isLoan = false;
          this.spinner.hide();
        }
        this.cdRef.detectChanges();
      }else{
         this.spinner.hide();
      }
       
    });
  }
  /*Método que controla el estado del activo*/
  updateE(e) {
    if (e.value === 'Disponible') {
      this.stateLoanTemp = 0;
    } else if (e.value === 'En Préstamo') {
      this.stateLoanTemp = 1;
    } else {
      this.stateLoanTemp = 2;
    }
  }
  /*Método que controla el DOM del aplicativo*/
  updateContent(e) {
    if (e) {
      this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '65px');
      this.footer.update(e);
    } else {
      this.footer.update(e);
      this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '250px');
    }
  }
  /*Método que controla el la actualización de Inputs*/
  updateValue(e) {}
  /*Método que fuerza una actualización*/
  update() {
    this.cdRef.detectChanges();
  }
  /*Método que redirije al Listado De Activos*/
  previous() {
    this._ngZone.run(() => {
      this._router.navigate(['/actives']);
    });
  }
  /*Método que redirije para editar el activo*/
  editActive() {
    localStorage.setItem('active', JSON.stringify(this.active));
    this._ngZone.run(() => {
      this._router.navigate(['/edit_actives', this.active.idActive]);
    });
  }
  /*Método que ejecuta el modal de editar la distribución del activo en áreas*/
  editDistribution() {
    let dialogRef = this.dialog.open(EditDistributionComponent, {
      height: '700px',
      width: '600px',
      data: {
        idActive: this.active.idActive,
        amount: this.active.amount,
        areas: this.areas,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.spinner.show();
      this.view();
    });
  }
  /*Método que válida si hay un nuevo estado*/
  validateNewState() {
    if (
      (this.active.isLoan === 0 || this.active.isLoan === 2) &&
      this.stateLoanTemp === 1
    ) {
      let dialogRef = this.dialog.open(RegisterLoanComponent, {
        height: '250px',
        width: '450px',
        data: {
          idActive: this.active.idActive,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.spinner.show();
        this.view();
        this.cdRef.detectChanges();
      });
    } else if (
      this.stateLoanTemp !== 1 &&
      this.stateLoanTemp !== this.active.isLoan
    ) {
      this.AlertService.confirmacion(
        '¿Esta seguro de cambiar el estado?',
        function (response, component) {
          if (response == true) {
            component.spinner.show();
            component.ActiveService.updateStatusLoan({
              idActive: component.active.idActive,
              status: component.stateLoanTemp,
            });
            electron.ipcRenderer.on(
              'updateStatusLoan',
              (event: any, data: any) => {
                if (data['res']) {
                  component.spinner.show();
                  component.view();
                  component.cdRef.detectChanges();
                }
              }
            );
          }
        },
        this
      );
    }
  }
  ngOnDestroy(): void {
    electron.ipcRenderer.removeAllListeners('activesById');
  }
}
