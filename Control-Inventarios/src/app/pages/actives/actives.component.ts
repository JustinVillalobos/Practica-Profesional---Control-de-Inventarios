import { Component, OnInit, ViewChild,ElementRef, Renderer2,NgZone  } from '@angular/core';
import {Router} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SortType } from '@swimlane/ngx-datatable/esm2015/public-api';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
const electron = (<any>window).require('electron');
import { AreaService } from 'src/app/shared/services/area.service';
import { AreaModel } from 'src/app/shared/models/AreaModel';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
import { EdificeService } from 'src/app/shared/services/edifice.service';
import { ActiveService } from 'src/app/shared/services/active.service';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';
@Component({
  selector: 'app-actives',
  templateUrl: './actives.component.html',
  styleUrls: ['./actives.component.scss']
})
export class ActivesComponent implements OnInit {
@ViewChild('pRef', {static: false}) pRef: ElementRef;
@ViewChild('SelectAreas', {static: false}) SelectAreas: InputFormComponent;
@ViewChild('SelectStatus', {static: false}) SelectStatus: InputFormComponent;
    @ViewChild('footer', { static: false }) footer: FooterComponent;
    rows = [];
  columns = [{ prop: 'name' }];
  temp = [];
   pageNumber = 0;
   limit = 10;

   status = [
     {name:"Todos"},
     {name:"Disponibles"},
     {name:"En Prestamo"}
   ];

    SortType = SortType;
    edifices: EdificeModel[];
    areas: AreaModel[];
    statusSelected = "Todos";
    areaSelected = "Todos";
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _ngZone: NgZone,
    private AreaService:AreaService,
    private EdificeService:EdificeService,
    private ActiveService:ActiveService,
    private AlertService:AlertService
    ) {

     this.temp = this.rows;
  }


  ngOnInit(): void {
    this.allEdifices();
    this.allAreas();
     this.allActives();
  }

  allEdifices(){
    this.spinner.show();
    this.EdificeService.allEdificesActives();
           electron.ipcRenderer.on("allEdificesActive", (event: any, data: any) => {
                if(data["res"]){                 
                   const edifices = data["edifices"].map(function(e) {
                     var isTrueSet = (e.isEnabled.toLowerCase() === 'true');
                        return {'idEdifice':e.idEdifice,'name':e.name,'isEnabled':isTrueSet};
                    });
                   this.edifices = edifices;
                   if(this.edifices.length==0){
                     this.AlertService.alertaError("Lo sentimos, primeramente ingresa algunos edificios");
                     
                     setInterval(function(){ 
                       
                     }, 2000);
                     this._ngZone.run(()=>{
                        this.router.navigate(['/edifices']);
                       });
                   }
                   this.setEdifice();
                }
            });
  }
  allAreas(){
     this.AreaService.allAreasActives();
           electron.ipcRenderer.on("allAreasActives", (event: any, data: any) => {
                if(data["res"]){              
                   const areas = data["areas"].map(function(e) {
                     var isTrueSet = (e.isEnabled.toLowerCase() === 'true');
                     let edifice ={
                                     idEdifice:e.idEdifice,
                                      name:e.edifice,
                                      isEnabled:true
                                   } ;
                        return {'idArea':e.idArea,'name':e.name,'isEnabled':isTrueSet,"edifice":edifice};
                    });
                   this.areas = areas;
                   if(this.areas.length<=0){
                     this.AlertService.alertaError("Lo sentimos, primeramente ingresa algunas áreas");
                     setInterval(function(){ 
                       
                     }, 2000);
                     this._ngZone.run(()=>{
                        this.router.navigate(['/areas']);
                       });
                   }
                       this.setArea();
                  
                }
            });
  }
  allActives(){
    this.ActiveService.allActives();
    electron.ipcRenderer.on("allActives", (event: any, data: any) => {
                if(data["res"]){          
                  const actives = data["actives"].map(function(e) {
                     var isTrueSet = (e.isLoan == 1);
                        return {'idActive':e.idActive,'name':e.name,'amount':e.amount,'licensePlate':e.licensePlate,'placeOrigin':e.placeOrigin,'isLoan':isTrueSet};
                    });                     
                   this.rows = actives;
                   this.temp = this.rows;
                   this.spinner.hide();
                }
            });
  }
  setEdifice(){
    this.edifices.unshift({idEdifice:0,name:"Todos"});
  }
  setArea(){
    this.areas.unshift({idArea:0,name:"Todos"});
  }
  updateContent(e){
    if(e){
      this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '65px');
      this.footer.update(e);
    }else{
       this.footer.update(e);
     this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '250px');
    }
  }
  getCellClass({ row, column, value }): any {
    let amount = 1;
    return {
      'amount': amount === 1
    };
  }
   updateValue(e){
    let val = e.value;
    val = val.toLowerCase();
    if(val!='' && val!=' '){
      const f = this.temp.filter(function (d) {
       if(d.licensePlate!=''){
          return (d.name.toLowerCase().indexOf(val) !== -1) || (d.placeOrigin.toLowerCase().indexOf(val) !== -1) || (d.licensePlate.toLowerCase().indexOf(val) !== -1)
        }else{
           return (d.name.toLowerCase().indexOf(val) !== -1) || (d.placeOrigin.toLowerCase().indexOf(val) !== -1)
        }
      });

      // update the rows
      this.rows = f;
      // Whenever the filter changes, always go back to the first page
      //this.table.offset = 0;
      this.pageNumber = 0;
    }else{
       this.rows = this.temp;
        this.pageNumber = 0;
    }
  }
  updateShow(e){
    this.limit = e.value;
  }
  updateEdifices(e){
    if(e.value!= "Todos"){
       this.allActives();
      let idEdifice =0;
        for(let i=0;i<this.edifices.length;i++){
          if(e.value == this.edifices[i].name){
            idEdifice = this.edifices[i].idEdifice;
          }
        }
       this.AreaService.allAreasByEdifice(idEdifice);
       electron.ipcRenderer.on("allAreasByEdifice", (event: any, data: any) => {
                if(data["res"]){                               
                   this.areas = data["areas"];
                   let flag=true;
                   for(let i=0;i<this.areas.length;i++){
                      if("Todos" == this.areas[i].name){
                       flag =false;
                      }
                    }
                    if(flag){
                      this.setArea();
                    }
                   this.SelectAreas.setText('Todos');
                   this.SelectStatus.setText('Todos');
                }
            });
       this.activesByEdificio(idEdifice);
     }else{
       this.allActives();
          this.allAreas();
         this.SelectAreas.setText('Todos');
     }
  }
  activesByEdificio(id){
    this.ActiveService.allActiveByEdifice(id);
    electron.ipcRenderer.on("activesByIdEdifice", (event: any, data: any) => {
                if(data["res"]){                               
                   const actives = data["actives"].map(function(e) {
                     var isTrueSet = (e.isLoan == 1);
                        return {'idActive':e.idActive,'name':e.name,'amount':e.amount,'licensePlate':e.licensePlate,'placeOrigin':e.placeOrigin,'isLoan':isTrueSet};
                    });                     
                   this.rows = actives;
                   this.temp = this.rows;
                }
            });
  }
  updateArea(e){
    this.areaSelected = e.value;
    if(e.value!= "Todos"){
        let idArea =0;
        for(let i=0;i<this.areas.length;i++){
          if(this.areaSelected === this.areas[i].name){
            idArea = this.areas[i].idArea;
          }
        }
         this.ActiveService.allActiveByArea(idArea);
         electron.ipcRenderer.on("activesByArea", (event: any, data: any) => {
                if(data["res"]){ 
                  const actives = data["actives"].map(function(e) {
                     var isTrueSet = (e.isLoan == 1);
                        return {'idActive':e.idActive,'name':e.name,'amount':e.amount,'licensePlate':e.licensePlate,'placeOrigin':e.placeOrigin,'isLoan':isTrueSet};
                    });                              
                   this.rows = actives;
                   this.temp = this.rows;
                }
            });
     }else{
       this.allActives();
     }
  }
   updateState(e){
     this.statusSelected = e.value;
     let status=false;
     if(e.value != 'Disponibles' && e.value!= "Todos"){
       status=true;
     }
    if(e.value !== 'Todos'){
       this.rows  = this.temp;
      this.rows = this.rows.filter(function (d) {
        return (d.isLoan == status)
      });
    }else{
       if(this.areaSelected !== "Todos"){
           let idArea =0;
          for(let i=0;i<this.areas.length;i++){
            if(this.areaSelected === this.areas[i].name){
              idArea = this.areas[i].idArea;
            }
          }
           this.ActiveService.allActiveByArea(idArea);
           electron.ipcRenderer.on("allActiveByArea", (event: any, data: any) => {
                  if(data["res"]){                               
                     const actives = data["actives"].map(function(e) {
                     var isTrueSet = (e.isLoan == 1);
                        return {'idActive':e.idActive,'name':e.name,'amount':e.amount,'licensePlate':e.licensePlate,'placeOrigin':e.placeOrigin,'isLoan':isTrueSet};
                    });                              
                   this.rows = actives;
                  }
              });
       }else{
         this.allActives();
       }
    }
  }
  generatePDF(){

  }
  AddActive(){
     this._ngZone.run(()=>{
      this.router.navigate(['/add']);
     });
  }
  viewActive(idActive){
    this._ngZone.run(()=>{
      this.router.navigate(['/view',idActive]);
     });
  }
   goRedirect(destiny){
     this._ngZone.run(()=>{
      this.router.navigate(['/'+destiny]);
     });
  }

}
