import { Component, OnInit,OnDestroy  } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit,OnDestroy  {
  mark:string="";
  marketOthers:string="";
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.auth.removeAllListeners("reply");
  }
  leaveSession(){
    this.auth.logout();
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
