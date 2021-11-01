import { Component, OnInit, ViewChild,ElementRef, Renderer2,NgZone  } from '@angular/core';
import {Router} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SortType } from '@swimlane/ngx-datatable/esm2015/public-api';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
@Component({
  selector: 'app-actives',
  templateUrl: './actives.component.html',
  styleUrls: ['./actives.component.scss']
})
export class ActivesComponent implements OnInit {

@ViewChild('pRef', {static: false}) pRef: ElementRef;
    @ViewChild('footer', { static: false }) footer: FooterComponent;
    rows = [
    {idActive:1,name:"Computadora de Escritorio",licencePlate:"",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Turrialba",isLoan:true},
    {idActive:3,name:"Activo 3",licencePlate:"332233",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Turrialba",isLoan:false},
    {idActive:4,name:"Activo 4",licencePlate:"343234",amount:50000,area:"Area 2",placeOrigin:"Universidad Costa Rica Rodrigo Facio",isLoan:true},
    {idActive:5,name:"Activo 5",licencePlate:"",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Rodrigo Facio",isLoan:true},
    {idActive:6,name:"Activo 6",licencePlate:"45345",amount:50000,area:"Area 2",placeOrigin:"Universidad Costa Rica Recinto Guapiles",isLoan:true},
    {idActive:7,name:"Activo 7",licencePlate:"",amount:50000,area:"Area 3",placeOrigin:"Desconocido",isLoan:true},
    {idActive:8,name:"Activo 8",licencePlate:"87667",amount:50000,area:"Area 4",placeOrigin:"Universidad Costa Rica Recinto Guapiles",isLoan:true},
    {idActive:9,name:"Activo 9",licencePlate:"3213123",amount:50000,area:"Area 1",placeOrigin:"Desconocido",isLoan:true},
    {idActive:11,name:"Activo 11",licencePlate:"4354435",amount:70000,area:"Area 1",placeOrigin:"Desconocido",isLoan:true},
    {idActive:1,name:"Computadora de Escritorio",licencePlate:"",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Turrialba",isLoan:true},
    {idActive:3,name:"Activo 3",licencePlate:"332233",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Turrialba",isLoan:false},
    {idActive:4,name:"Activo 4",licencePlate:"343234",amount:50000,area:"Area 2",placeOrigin:"Universidad Costa Rica Rodrigo Facio",isLoan:true},
    {idActive:5,name:"Activo 5",licencePlate:"",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Rodrigo Facio",isLoan:true},
    {idActive:6,name:"Activo 6",licencePlate:"45345",amount:50000,area:"Area 2",placeOrigin:"Universidad Costa Rica Recinto Guapiles",isLoan:true},
    {idActive:7,name:"Activo 7",licencePlate:"",amount:50000,area:"Area 3",placeOrigin:"Desconocido",isLoan:true},
    {idActive:8,name:"Activo 8",licencePlate:"87667",amount:50000,area:"Area 4",placeOrigin:"Universidad Costa Rica Recinto Guapiles",isLoan:true},
    {idActive:9,name:"Activo 9",licencePlate:"3213123",amount:50000,area:"Area 1",placeOrigin:"Desconocido",isLoan:true},
    {idActive:11,name:"Activo 11",licencePlate:"4354435",amount:70000,area:"Area 1",placeOrigin:"Desconocido",isLoan:true},
    {idActive:1,name:"Computadora de Escritorio",licencePlate:"",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Turrialba",isLoan:true},
    {idActive:3,name:"Activo 3",licencePlate:"332233",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Turrialba",isLoan:false},
    {idActive:4,name:"Activo 4",licencePlate:"343234",amount:50000,area:"Area 2",placeOrigin:"Universidad Costa Rica Rodrigo Facio",isLoan:true},
    {idActive:5,name:"Activo 5",licencePlate:"",amount:50000,area:"Area 1",placeOrigin:"Universidad Costa Rica Rodrigo Facio",isLoan:true},
    {idActive:6,name:"Activo 6",licencePlate:"45345",amount:50000,area:"Area 2",placeOrigin:"Universidad Costa Rica Recinto Guapiles",isLoan:true},
    {idActive:7,name:"Activo 7",licencePlate:"",amount:50000,area:"Area 3",placeOrigin:"Desconocido",isLoan:true},
    {idActive:8,name:"Activo 8",licencePlate:"87667",amount:50000,area:"Area 4",placeOrigin:"Universidad Costa Rica Recinto Guapiles",isLoan:true},
    {idActive:9,name:"Activo 9",licencePlate:"3213123",amount:50000,area:"Area 1",placeOrigin:"Desconocido",isLoan:true},
    {idActive:11,name:"Activo 11",licencePlate:"4354435",amount:70000,area:"Area 1",placeOrigin:"Desconocido",isLoan:true},
  ];
  //idActive,name,licencePlate,amount, area,placeOrigin isLoan,
  columns = [{ prop: 'name' }];
  temp = [];
   pageNumber = 0;
   limit = 10;
   edifices = [
     {name:"Edificio 1"},
     {name:"Edificio 2"},
     {name:"Edificio 3"},
     {name:"Edificio 4"}
   ];
   areas = [
     {name:"Area 1"},
     {name:"Area 2"},
     {name:"Area 3"},
     {name:"Area 4"}
   ];
   status = [
     {name:"Todos"},
     {name:"Disponibles"},
     {name:"En Prestamo"}
   ];

    SortType = SortType;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _ngZone: NgZone
    ) {

     this.temp = this.rows;
  }


  ngOnInit(): void {
    this.setEdifice();
  }

  setEdifice(){
    this.edifices.unshift({name:"Todos"});

    this.setArea();
  }
  setArea(){
    this.areas.unshift({name:"Todos"});
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
   updateValue(e){
    let val = e.value;
    val = val.toLowerCase();
    if(val!='' && val!=' '){
      const f = this.temp.filter(function (d) {
        return (d.name.toLowerCase().indexOf(val) !== -1) || (d.area.toLowerCase().indexOf(val) !== -1)
        || (d.placeOrigin.toLowerCase().indexOf(val) !== -1)
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

  }
  updateArea(e){
    
  }
   updateState(e){
    
  }
  generatePDF(){

  }
  AddActive(){
     this._ngZone.run(()=>{
      this.router.navigate(['/add']);
     });
  }
  viewActive(idActive){
    //this.goRedirect('view/'+idActive);
    this._ngZone.run(()=>{
      this.router.navigate(['/view',idActive]);
     });
  }
   goRedirect(destiny){
     console.log("Ingreso redirect");
     this._ngZone.run(()=>{
      this.router.navigate(['/'+destiny]);
     });
  }

}
