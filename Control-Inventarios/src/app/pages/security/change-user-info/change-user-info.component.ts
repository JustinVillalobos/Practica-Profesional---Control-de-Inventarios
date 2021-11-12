import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { PasswordService } from 'src/app/shared/services/password.service';
const electron = (<any>window).require('electron');
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
@Component({
  selector: 'app-change-user-info',
  templateUrl: './change-user-info.component.html',
  styleUrls: ['./change-user-info.component.scss']
})
export class ChangeUserInfoComponent implements OnInit {

   @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  userControl = {isInvalid:false,error:""};
   emailControl = {isInvalid:false,error:""};
  psw = {isInvalid:false,error:""};
  password ="";
  email ="";
  user ="";
  constructor(
    private renderer: Renderer2,
      private validation:ValidationsService,
    private spinner: NgxSpinnerService,
    private AlertService:AlertService,
    private PasswordService:PasswordService
    ) {}


  ngOnInit(): void {
    this.userInfo();
  }

  userInfo(){
    this.PasswordService.userData({token:localStorage.getItem('idToken')});
       electron.ipcRenderer.on("editUser", (event: any, data: any) => {
         console.log(data);
           if(data["res"]){
             this.user = data["user"][0].name;
             this.email = data["user"][0].email;
           }
       });
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
    if(e.name =="psw"){
      this.password = e.value;
    }else if(e.name =="user"){
      this.user = e.value;
    }else if(e.name=="email"){
      this.email = e.value;
    }
  }
  save(){
    if(this.user == ''){
      this.userControl.isInvalid = true;
      this.userControl.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.user,this.validation.AlphaNumericAndSpacePattern())){
      this.userControl.isInvalid = true;
       this.userControl.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.user,125)){
       this.userControl.isInvalid = true;
       this.userControl.error = "El nombre es muy extenso";
    }else{
       this.userControl.isInvalid = false;
    }
    if(this.password == ''){
      this.psw.isInvalid = true;
      this.psw.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.password,this.validation.AlphaNumericAndSpacePattern())){
      this.psw.isInvalid = true;
       this.psw.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.password,125)){
       this.psw.isInvalid = true;
       this.psw.error = "La contraseña es muy extensa";
    }else{
       this.psw.isInvalid = false;
    }
    if(this.email == ''){
      this.emailControl.isInvalid = true;
      this.emailControl.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.email,this.validation.AlphaNumericAndSpacePattern())){
      this.emailControl.isInvalid = true;
       this.emailControl.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.email,125)){
       this.emailControl.isInvalid = true;
       this.emailControl.error = "El correo es muy extenso";
    }else{
       this.emailControl.isInvalid = false;
    }
    if(!this.psw.isInvalid && !this.emailControl.isInvalid && !this.userControl.isInvalid ){
      this.spinner.show();
      this.PasswordService.changeData({user:this.user,email:this.email,token:localStorage.getItem('idToken')});
       electron.ipcRenderer.on("editUser", (event: any, data: any) => {
          this.spinner.hide(); 
                if(data["res"]){ 
                this.spinner.hide(); 
                   this.AlertService.alertTimeCorrect("Se ha enviado un mensaje al correo adjuntado a tu usuario",function(_component){
                                           _component.edifice.name="";
                                           _component.dialog.closeAll();
                                 },this);
                 }else{
                    this.AlertService.alertaError("Usuario no encontrado en el sistema");
                 }
            });
    }else{
      return;
    }
  }

}
