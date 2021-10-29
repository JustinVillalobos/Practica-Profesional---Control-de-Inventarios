import { Component, OnInit,NgZone  } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {

  mark:string="";
  marketOthers:string="";
  constructor(
    private router: Router,
    private _ngZone: NgZone
    ) { }

  ngOnInit(): void {
  }
  goRedirect(destiny){
     this._ngZone.run(()=>{
      this.router.navigate(['/'+destiny]);
     });
  }
  market(){
    if(this.mark==="market"){
      this.mark="";
    }else{
      this.mark="market";
    }
  }
  marketOthersMethod(){
    if(this.marketOthers==="market"){
      this.marketOthers="";
    }else{
      this.marketOthers="market";
    }
  }

}
