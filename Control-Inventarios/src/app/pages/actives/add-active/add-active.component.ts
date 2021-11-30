import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  NgZone,
} from '@angular/core';
import { ActiveService } from 'src/app/shared/services/active.service';
const electron = (<any>window).require('electron');
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { AreaService } from 'src/app/shared/services/area.service';
import { AreaModel } from 'src/app/shared/models/AreaModel';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
import { EdificeService } from 'src/app/shared/services/edifice.service';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
@Component({
  selector: 'app-add-active',
  templateUrl: './add-active.component.html',
  styleUrls: ['./add-active.component.scss'],
})
export class AddActiveComponent implements OnInit {
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  active = {
    idActive: 0,
    name: '',
    licensePlate: '',
    amount: 1,
    description: '',
    placeOrigin: '',
    mark: '',
    model: '',
    serie: '',
    isLoan: false,
  };
  amount = 0;
  edifices = [];
  allAreas = [];
  areas = [];
  areaSelected = '';
  edificeSelected = '';
  amountArea = 1;
  tempAreas = [];
  activeControls = {
    name: { error: '', isInvalid: false },
    licensePlate: { error: '', isInvalid: false },
    description: { error: '', isInvalid: false },
    placeOrigin: { error: '', isInvalid: false },
    mark: { error: '', isInvalid: false },
    model: { error: '', isInvalid: false },
    serie: { error: '', isInvalid: false },
  };
  origins = [
    { name: 'Donación' },
    { name: 'Contratación Directa' },
    { name: 'Comisión' },
    { name: 'Traslado' },
    { name: 'Otros' },
  ];
  isVisible = true;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private validation: ValidationsService,
    private AlertService: AlertService,
    private _router: Router,
    private _ngZone: NgZone,
    private ActiveService: ActiveService,
    private AreaService: AreaService,
    private EdificeService: EdificeService
  ) {}

  ngOnInit(): void {
    this.allEdifices();
    this.allAreasSelect();
  }
  /*Método que carga todos los edificios*/
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
  /*Método que carga todas las áreas*/
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
   /*Método que controla el Origen del activo*/
  updateOrigin(e) {
    if (e.value == 'Otros') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      this.active.placeOrigin = e.value;
    }
  }
  /*Método que controla los Inputs*/
  updateValue(e) {
    if (e.name == 'amount') {
      if (this.active.amount > e.value) {
        this.areas = [];
      }
      this.amountArea = 1;
      this.active.amount = e.value;
    }
    if (e.name === 'amountArea') {
      this.amountArea = parseInt(e.value);
    }
    if (e.name == 'amount') {
      this.active.amount = e.value;
      if (this.active.amount > 1) {
        this.active.licensePlate = '';
      }
    } else if (e.name == 'description') {
      this.active.description = e.value;
    } else if (e.name == 'licensePlate') {
      this.active.licensePlate = e.value;
    } else if (e.name == 'mark') {
      this.active.mark = e.value;
    } else if (e.name == 'model') {
      this.active.model = e.value;
    } else if (e.name == 'serie') {
      this.active.serie = e.value;
    } else if (e.name == 'placeOrigin') {
      this.active.placeOrigin = e.value;
    } else if (e.name == 'name') {
      this.active.name = e.value;
    }
  }
 /*Método que controla la dependencia áreas por edificio*/
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
   /*Método que controla la área seleccionada*/
  updateArea(e) {
    this.areaSelected = e.value;
  }
   /*Método que obtiene el Id del área seleccionada*/
  getIdArea() {
    let countAmount = 0;
    for (let i = 0; i < this.allAreas.length; i++) {
      countAmount = countAmount + this.allAreas[i].amount;
      if (this.allAreas[i].name === this.areaSelected) {
        return this.allAreas[i].idArea;
      }
    }
  }
   /*Método que guarda la información de la distribución del activo*/
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
      if (this.active.amount >= countAmount) {
        this.amount = countAmount;
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
      if (this.active.amount >= countAmount) {
        this.amount = countAmount;
        this.areas[position].amount =
          this.areas[position].amount + this.amountArea;
      } else {
        this.AlertService.alertaError('Excede la cantidad total');
      }
    }
  }
   /*Método que remueve elementos del listado de áreas donde se distribuyó el activo*/
  remove(area) {
    this.areas = this.areas.filter((res) => {
      if (res.name == area) {
        this.amount = this.amount - res.amount;
      }
      return res.name !== area;
    });
  }
   /*Método que redirije a ver todos los activos*/
  previous() {
    this._ngZone.run(() => {
      this._router.navigate(['/actives']);
    });
  }
   /*Método de búsqueda de áreas*/
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
   /*Método que válida la cantidad de items asignados a las áreas*/
  getCountByArea() {
    let countAmount = 0;
    for (let i = 0; i < this.areas.length; i++) {
      countAmount = countAmount + this.areas[i].amount;
    }
    return countAmount;
  }
   /*Método que guarda la información del activo*/
  save() {
    if (this.active.name == '') {
      this.activeControls.name.isInvalid = true;
      this.activeControls.name.error = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.active.name,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.activeControls.name.isInvalid = true;
      this.activeControls.name.error =
        'Solo se aceptan Carácteres Alfanúmerics';
    } else if (!this.validation.validateLength(this.active.name, 150)) {
      this.activeControls.name.isInvalid = true;
      this.activeControls.name.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.name.isInvalid = false;
    }

    if (this.active.licensePlate == '') {
      this.activeControls.licensePlate.isInvalid = false;
    } else if (
      this.validation.evaluateValue(
        this.active.licensePlate,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.activeControls.licensePlate.isInvalid = true;
      this.activeControls.licensePlate.error =
        'Solo se aceptan Carácteres Alfanúmerics';
    } else if (!this.validation.validateLength(this.active.licensePlate, 100)) {
      this.activeControls.licensePlate.isInvalid = true;
      this.activeControls.licensePlate.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.licensePlate.isInvalid = false;
    }

    if (this.active.description == '') {
      this.activeControls.description.isInvalid = true;
      this.activeControls.description.error = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.active.description,
        this.validation.MixtAltPattern()
      )
    ) {
      this.activeControls.description.isInvalid = true;
      this.activeControls.description.error =
        'Solo se aceptan Carácteres Alfanúmericos y comas';
    } else if (!this.validation.validateLength(this.active.description, 300)) {
      this.activeControls.description.isInvalid = true;
      this.activeControls.description.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.description.isInvalid = false;
    }

    if (this.active.placeOrigin == '') {
      this.activeControls.placeOrigin.isInvalid = true;
      this.activeControls.placeOrigin.error = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.active.placeOrigin,
        this.validation.MixtPattern()
      )
    ) {
      this.activeControls.placeOrigin.isInvalid = true;
      this.activeControls.placeOrigin.error =
        'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.active.placeOrigin, 150)) {
      this.activeControls.placeOrigin.isInvalid = true;
      this.activeControls.placeOrigin.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.placeOrigin.isInvalid = false;
    }

    if (this.active.mark == '') {
      this.activeControls.mark.isInvalid = false;
    } else if (
      this.validation.evaluateValue(
        this.active.mark,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.activeControls.mark.isInvalid = true;
      this.activeControls.mark.error =
        'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.active.mark, 50)) {
      this.activeControls.mark.isInvalid = true;
      this.activeControls.mark.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.mark.isInvalid = false;
    }

    if (this.active.model == '') {
      this.activeControls.model.isInvalid = false;
    } else if (
      this.validation.evaluateValue(
        this.active.model,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.activeControls.model.isInvalid = true;
      this.activeControls.model.error =
        'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.active.model, 50)) {
      this.activeControls.model.isInvalid = true;
      this.activeControls.model.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.model.isInvalid = false;
    }

    if (this.active.serie == '') {
      this.activeControls.serie.isInvalid = false;
    } else if (
      this.validation.evaluateValue(
        this.active.serie,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.activeControls.serie.isInvalid = true;
      this.activeControls.serie.error =
        'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.active.serie, 50)) {
      this.activeControls.serie.isInvalid = true;
      this.activeControls.serie.error = 'El nombre es muy extenso';
    } else {
      this.activeControls.serie.isInvalid = false;
    }

    if (this.areaSelected == '') {
      this.AlertService.alertaError('No has seleccionado ninguna área');
      return;
    }
    if (this.isValid()) {
      if (this.active.amount == this.getCountByArea()) {
        this.spinner.show();
        this.ActiveService.addActive({
          active: this.active,
          areas: this.areas,
        });
        electron.ipcRenderer.on('addActive', (event: any, data: any) => {
          if (data['res']) {
            this.spinner.hide();
            this.AlertService.alertTimeCorrect(
              'Información guardada con éxito',
              function (_component) {
                _component.redirectTo();
              },
              this
            );
          }
        });
      } else {
        this.AlertService.alertaError('Faltan activos que distribuir');
      }
    } else {
    }
  }
  /*Método que redirije a visualizar el activo*/
  redirectTo() {
    this._ngZone.run(() => {
      this._router.navigate(['/actives']);
    });
  }
  /*Método que maneja las validaciones de estado*/
  isValid() {
    return (
      !this.activeControls.serie.isInvalid &&
      !this.activeControls.model.isInvalid &&
      !this.activeControls.mark.isInvalid &&
      !this.activeControls.placeOrigin.isInvalid &&
      !this.activeControls.licensePlate.isInvalid &&
      !this.activeControls.description.isInvalid &&
      !this.activeControls.name.isInvalid
    );
  }
}
