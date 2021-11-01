import { Component, OnInit, ViewChild,ElementRef, Renderer2,NgZone } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import {ActivatedRoute,Router} from "@angular/router";
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
    description:"Esto es una descripcion",
    area:"Area 1",
    placeOrigin:"Universidad de Costa Rica Recinto Guailes",
    mark:"Marca",
    model:"Modelo",
    seria:"Seria",
    isLoan:true
  }
   //idActive,name,licencePlate,amount, area,placeOrigin isLoan,
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router:ActivatedRoute,
    private _router:Router,
    private _ngZone:NgZone
    ) {}


  ngOnInit(): void {
    this.active.idActive = parseInt(this.router.snapshot.paramMap.get('idActive'));
    console.log(this.active.idActive);

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

}
