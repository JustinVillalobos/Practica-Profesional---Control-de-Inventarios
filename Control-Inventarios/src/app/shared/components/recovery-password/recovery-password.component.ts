import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { PasswordService } from 'src/app/shared/services/password.service';
import { NgxSpinnerService } from "ngx-spinner";
const electron = (<any>window).require('electron');
@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
   isInvalidName :boolean = false;
  errorInputName: string = "";
  username:string ="";
  constructor( 
    private dialog:MatDialog,
    private spinner: NgxSpinnerService,
    private validation:ValidationsService,
    private AlertService:AlertService,
    private PasswordService:PasswordService
    ) { }

  ngOnInit(): void {
  }

  updateValue(e){
     this.username = e.value;
  }
  save(){    
    if(this.username == ''){
      this.isInvalidName = true;
      this.errorInputName = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.username,this.validation.AlphaNumericAndSpacePattern())){
      this.isInvalidName = true;
      this.errorInputName = "Solo se aceptan Carácteres Alfanúmerics";
    }else if(!this.validation.validateLength(this.username,125)){
      this.isInvalidName = true;
      this.errorInputName = "El nombre es muy extenso";
    }else{
       this.isInvalidName = false;
    }

    if(!this.isInvalidName ){
      this.spinner.show();
      this.PasswordService.validateUser(this.username);
       electron.ipcRenderer.on("validateUser", (event: any, data: any) => {
          this.spinner.hide(); 
                if(data["res"]){ 
                this.spinner.hide(); 
                   this.AlertService.alertTimeCorrect("Se ha enviado un mensaje al correo adjuntado a tu usuario",function(_component){
                                           _component.edifice.username="";
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
