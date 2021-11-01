import { Component, OnInit, ViewChild,ElementRef, Renderer2,NgZone } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import {ActivatedRoute,Router} from "@angular/router";
import { RegisterLoanComponent } from 'src/app/shared/components/actives/register-loan/register-loan.component';

@Component({
  selector: 'app-view-active',
  templateUrl: './view-active.component.html',
  styleUrls: ['./view-active.component.scss']
})
export class ViewActiveComponent implements OnInit {

 @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  active = {
    idActive:1,
    name:"Computadora de Escritorio",
    licencePlate:"7474843",
    amount:5000,
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    area:"Area 1",
    placeOrigin:"Universidad de Costa Rica Recinto Guailes",
    mark:"Marca",
    model:"Modelo",
    seria:"Seria",
    isLoan:false,
    loan:{
      idLoan:1,
      name:"Justin Villalobos Espinoza",
      date:new Date()
    },
    edifice:"Edificio 1"
  }
  stateLoanTemp = true;
   //idActive,name,licencePlate,amount, area,placeOrigin isLoan,
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router:ActivatedRoute,
    private _router:Router,
    private _ngZone:NgZone,
    public dialog: MatDialog
    ) {}


  ngOnInit(): void {
    this.active.idActive = parseInt(this.router.snapshot.paramMap.get('idActive'));
    console.log(this.active.idActive);

  }
  updateE(e){
    console.log(e);
    if(e.value === 'Disponible'){
      this.stateLoanTemp = false;
    }else{
      this.stateLoanTemp = true;
    }
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
    console.log(e);
  }
  previous(){
    this._ngZone.run(()=>{
      this._router.navigate(['/actives']);
     });
  }
  editActive(){
    this._ngZone.run(()=>{
      this._router.navigate(['/edit_actives',this.active.idActive]);
     });
  }
  validateNewState(){
    if(this.active.isLoan===false && this.stateLoanTemp===true){
      //changeState
      this.dialog.open(RegisterLoanComponent, {
       height: '250px',
       width: '450px'
     });
    }
  }

}
