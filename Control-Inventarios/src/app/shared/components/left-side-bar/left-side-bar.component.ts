import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {

  mark:string="";
  marketOthers:string="";
  constructor() { }

  ngOnInit(): void {
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
