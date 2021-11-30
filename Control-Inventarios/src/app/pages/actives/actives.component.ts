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
import { Router } from '@angular/router';
import { interval as observableInterval } from 'rxjs';
import { takeWhile, scan, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { SortType } from '@swimlane/ngx-datatable/esm2015/public-api';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
const electron = (<any>window).require('electron');
import { AreaService } from 'src/app/shared/services/area.service';
import { AreaModel } from 'src/app/shared/models/AreaModel';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
import { EdificeService } from 'src/app/shared/services/edifice.service';
import { ActiveService } from 'src/app/shared/services/active.service';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';
@Component({
  selector: 'app-actives',
  templateUrl: './actives.component.html',
  styleUrls: ['./actives.component.scss'],
})
export class ActivesComponent implements OnInit, OnDestroy {
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('SelectAreas', { static: false }) SelectAreas: InputFormComponent;
  @ViewChild('SelectStatus', { static: false })
  SelectStatus: InputFormComponent;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  rows = [];
  columns = [{ prop: 'name' }];
  temp = [];
  temp2 = [];
  pageNumber = 0;
  limit = 10;

  status = [
    { name: 'Todos' },
    { name: 'Disponibles' },
    { name: 'Proceso Desecho' },
    { name: 'En Prestamo' },
  ];

  SortType = SortType;
  edifices: EdificeModel[];
  areas: AreaModel[];
  statusSelected = 'Todos';
  areaSelected = 'Todos';
  page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    min: 0,
    max: this.limit - 1,
  };
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private AreaService: AreaService,
    private EdificeService: EdificeService,
    private ActiveService: ActiveService,
    private AlertService: AlertService
  ) {
    this.temp = this.rows;
  }

  ngOnInit(): void {
    this.allEdifices();
    this.allAreas();
    this.allActives();
  }
  /*Método que consulta por los edificios*/
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
        if (this.edifices.length == 0) {
          this.AlertService.alertaError(
            'Lo sentimos, primeramente ingresa algunos edificios'
          );

          setInterval(function () {}, 2000);
          this._ngZone.run(() => {
            this.router.navigate(['/edifices']);
          });
        }else{
          this.setEdifice();
        }  
      }
    });
  }
  /*Método que consulta por las áreas*/
  allAreas() {
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
        this.areas = areas;

        if (this.areas.length <= 0) {
          this.AlertService.alertaError(
            'Lo sentimos, primeramente ingresa algunas áreas'
          );
          setInterval(function () {}, 2000);
          this._ngZone.run(() => {
            this.router.navigate(['/areas']);
          });
        }else{
           this.setArea();
        }
       
      }
    });
  }
  /*Método que consulta por todos los activos*/
  allActives() {
    this.ActiveService.allActives();
    electron.ipcRenderer.on('allActives', (event: any, data: any) => {
      if (data['res']) {
        this.temp = data['actives'];
        this.temp2 = this.temp;
        this.setPage({ offset: 0 }, false);
        this.spinner.hide();
      }
    });
  }
  /*Método que agrega una opción por defecto a los edificios*/
  setEdifice() {
    this.edifices.unshift({ idEdifice: 0, name: 'Todos' });
  }
  /*Método que agrega una opción por defecto a las áreas*/
  setArea() {
    this.areas.unshift({ idArea: 0, name: 'Todos' });
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
  /*Método que controla el renderizado de celda en la tabla para centrado*/
  getCellClass({ row, column, value }): any {
    let amount = 1;
    return {
      amount: amount === 1,
    };
  }
  /*Método que controla los Inputs*/
  updateValue(e) {
    let val = e.value;
    val = val.toLowerCase();
    if (val != '' && val != ' ') {
      const f = this.temp.filter(function (d) {
        if (d.licensePlate != '' && d.licensePlate!=null && d.licensePlate!=undefined) {
          if(d.placeOrigin!="" && d.placeOrigin!=null && d.placeOrigin!=undefined){
             return (
              d.name.toLowerCase().indexOf(val) !== -1 ||
              d.placeOrigin.toLowerCase().indexOf(val) !== -1 ||
              d.licensePlate.toLowerCase().indexOf(val) !== -1
            );
           }else{
              return (
              d.name.toLowerCase().indexOf(val) !== -1 ||
              d.licensePlate.toLowerCase().indexOf(val) !== -1
            );
           }
         
        } else {
            if(d.placeOrigin!="" && d.placeOrigin!=null && d.placeOrigin!=undefined){
              return (
                d.name.toLowerCase().indexOf(val) !== -1 ||
                d.placeOrigin.toLowerCase().indexOf(val) !== -1
              );
            }else{
              return (
                d.name.toLowerCase().indexOf(val) !== -1
              );
            }
        }
      });
      this.rows = f;
      this.pageNumber = 0;
    } else {
      this.rows = this.temp;
      this.pageNumber = 0;
    }
  }
  /*Método que controla select por estado*/
  updateShow(e) {
    this.limit = parseInt(e.value, 10);
    this.setPage({ offset: 0 }, false);

    this.table.limit = parseInt(e.value, 10);
    this.table.recalculate();
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        this.table.offset = Math.floor(
          (this.table.rowCount - 1) / this.table.limit
        );
        // this.table.offset = 0;
      }
    });
  }
  /*Método que filtra activos por edificio*/
  updateEdifices(e) {
    if (e.value != 'Todos') {
      this.allActives();
      let idEdifice = 0;
      for (let i = 0; i < this.edifices.length; i++) {
        if (e.value == this.edifices[i].name) {
          idEdifice = this.edifices[i].idEdifice;
        }
      }
      this.AreaService.allAreasByEdifice(idEdifice);
      electron.ipcRenderer.on('allAreasByEdifice', (event: any, data: any) => {
        if (data['res']) {
          this.areas = data['areas'];
          let flag = true;
          for (let i = 0; i < this.areas.length; i++) {
            if ('Todos' == this.areas[i].name) {
              flag = false;
            }
          }
          if (flag) {
            this.setArea();
          }
          this.SelectAreas.setText('Todos');
          this.SelectStatus.setText('Todos');
          this.cdRef.detectChanges();
        }
      });
      this.activesByEdificio(idEdifice);
    } else {
      this.allActives();
      this.allAreas();
      this.SelectAreas.setText('Todos');
    }
  }
  /*Método que guarda la información del anterior filtro por edificio*/
  activesByEdificio(id) {
    this.ActiveService.allActiveByEdifice(id);
    electron.ipcRenderer.on('activesByIdEdifice', (event: any, data: any) => {
      if (data['res']) {
        this.temp = data['actives'];
        this.setPage({ offset: 0 }, false);
        this.cdRef.detectChanges();
      }
    });
  }
  /*Método que filtra los activos por área*/
  updateArea(e) {
    this.areaSelected = e.value;
    if (e.value != 'Todos') {
      let idArea = 0;
      for (let i = 0; i < this.areas.length; i++) {
        if (this.areaSelected === this.areas[i].name) {
          idArea = this.areas[i].idArea;
        }
      }
      this.ActiveService.allActiveByArea(idArea);
      electron.ipcRenderer.on('activesByArea', (event: any, data: any) => {
        if (data['res']) {
          this.temp = data['actives'];
          this.setPage({ offset: 0 }, false);
          this.cdRef.detectChanges();
        }
      });
    } else {
      this.allActives();
    }
  }
  /*Método que filtra por el estado*/
  updateState(e) {
    this.statusSelected = e.value;
    let status = 0;
    if (e.value != 'Proceso Desecho' && e.value != 'Disponibles' && e.value != 'Todos') {
      status = 1;
    }else if(e.value == 'Proceso Desecho'){
      status=2;
    }
    if (e.value !== 'Todos') {
      this.temp = this.temp2;
      this.temp = this.temp.filter(function (d) {
        return d.isLoan == status;
      });
      this.setPage({ offset: 0 }, false);
      this.cdRef.detectChanges();
    } else {
      if (this.areaSelected !== 'Todos') {
        let idArea = 0;
        for (let i = 0; i < this.areas.length; i++) {
          if (this.areaSelected === this.areas[i].name) {
            idArea = this.areas[i].idArea;
          }
        }
        this.ActiveService.allActiveByArea(idArea);
        electron.ipcRenderer.on('allActiveByArea', (event: any, data: any) => {
          if (data['res']) {
            const actives = data['actives'].map(function (e) {
              var isTrueSet = e.isLoan == 1;
              return {
                idActive: e.idActive,
                name: e.name,
                amount: e.amount,
                licensePlate: e.licensePlate,
                placeOrigin: e.placeOrigin,
                isLoan: isTrueSet,
              };
            });
            this.temp = actives;
            this.setPage({ offset: 0 }, false);
            this.cdRef.detectChanges();
          }
        });
      } else {
        this.allActives();
      }
    }
  }
  generatePDF() {}
  /*Método que redirije para agregar un activo*/
  AddActive() {
    this._ngZone.run(() => {
      this.router.navigate(['/add']);
    });
  }
  /*Método que redirije para visualizar un activo*/
  viewActive(idActive) {
    this._ngZone.run(() => {
      this.router.navigate(['/view', idActive]);
    });
  }
  /*Método que redirije a un destinado*/
  goRedirect(destiny) {
    this._ngZone.run(() => {
      this.router.navigate(['/' + destiny]);
    });
  }
  /*Método que controla la páginación*/
  onPaginated(event, container) {
    this.setPage(event, true, container);
    this.table.limit = this.limit;
    this.table.recalculate();
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        this.table.offset = Math.floor(
          (this.table.rowCount - 1) / this.table.limit
        );
      }
    });
  }
  /*Método que actualiza la página de una tabla*/
  setPage(pageInfo, optional, container?) {
    let flag = false;
    this.rows = [];
    this.page.totalElements = this.temp.length;
    this.page.min = pageInfo.offset * this.limit;
    this.page.max = this.page.min + this.limit;
    if (this.page.max > this.temp.length) {
      this.page.max = this.temp.length;
    }
    for (let i = this.page.min; i < this.page.max; i++) {
      this.rows.push(this.temp[i]);
    }
    if (optional) {
      this.scrollToTop(container);
    }

    this.cdRef.detectChanges();
  }
  /*Método que controla el scroll*/
  scrollToTop(el) {
    const duration = 600;
    const interval = 5;
    const move = (el.scrollTop * interval) / duration;
    observableInterval(interval)
      .pipe(
        scan((acc, curr) => acc - move, el.scrollTop),
        tap((position) => (el.scrollTop = position)),
        takeWhile((val) => val > 0)
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    electron.ipcRenderer.removeAllListeners('allEdificesActive');
    electron.ipcRenderer.removeAllListeners('allActiveByArea');
    electron.ipcRenderer.removeAllListeners('allActives');
    electron.ipcRenderer.removeAllListeners('allAreasActives');
    electron.ipcRenderer.removeAllListeners('allEdificesActive');
  }
}
