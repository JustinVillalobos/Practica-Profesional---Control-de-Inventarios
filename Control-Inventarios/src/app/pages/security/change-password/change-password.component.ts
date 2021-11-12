import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { PasswordService } from 'src/app/shared/services/password.service';
const electron = (<any>window).require('electron');
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

   @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  psw = {isInvalid:false,error:""};
  newpsw = {isInvalid:false,error:""};
  newpsw2 = {isInvalid:false,error:""};
  password ="";
  newPassword ="";
  newRepeatPassword ="";
  constructor(
     private renderer: Renderer2,
      private validation:ValidationsService,
    private spinner: NgxSpinnerService,
    private AlertService:AlertService,
    private PasswordService:PasswordService
    ) {}


  ngOnInit(): void {
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
    }else if(e.name =="npsw"){
      this.newPassword = e.value;
    }else if(e.name=="npsw2"){
      this.newRepeatPassword = e.value;
    }
  }
  save(){
    if(this.password == ''){
      this.psw.isInvalid = true;
      this.psw.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.password,this.validation.AlphaNumericAndSpacePattern())){
      this.psw.isInvalid = true;
       this.psw.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.password,125)){
       this.psw.isInvalid = true;
       this.psw.error = "El nombre es muy extenso";
    }else{
       this.psw.isInvalid = false;
    }
    if(this.newPassword == ''){
      this.newpsw.isInvalid = true;
      this.newpsw.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.newPassword,this.validation.AlphaNumericAndSpacePattern())){
      this.newpsw.isInvalid = true;
       this.newpsw.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.newPassword,125)){
       this.newpsw.isInvalid = true;
       this.newpsw.error = "La contraseña es muy extensa";
    }else{
       this.newpsw.isInvalid = false;
    }
    if(this.newRepeatPassword == ''){
      this.newpsw2.isInvalid = true;
      this.newpsw2.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.newRepeatPassword,this.validation.AlphaNumericAndSpacePattern())){
      this.newpsw2.isInvalid = true;
       this.newpsw2.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.newRepeatPassword,125)){
       this.newpsw2.isInvalid = true;
       this.newpsw2.error = "El correo es muy extenso";
    }else{
       this.newpsw2.isInvalid = false;
    }
    if(!this.psw.isInvalid && !this.newpsw.isInvalid && !this.newpsw2.isInvalid ){
      this.spinner.show();
      this.PasswordService.changePassword({password:this.password,newPassword:this.newPassword,token:localStorage.getItem('idToken')});
       electron.ipcRenderer.on("editPassword", (event: any, data: any) => {
          this.spinner.hide(); 
                if(data["res"]){ 
                this.spinner.hide(); 
                   this.AlertService.alertTimeCorrect("Se ha enviado cambiado la contraseña",function(_component){
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
