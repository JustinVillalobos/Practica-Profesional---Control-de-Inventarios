import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad{
  private router: Router
  onstructor() {
  }
 
  canLoad(route: Route): boolean {
    
    try{
      let token =  localStorage.getItem("idToken");
      if(token!=''){
        return true;
      }else{
        return false;
      }
    }catch(e){
      return false;
    }
 
    return true; 
  }
}
