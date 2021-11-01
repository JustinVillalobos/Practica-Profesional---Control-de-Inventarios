import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';

@Component({
  selector: 'app-register-loan',
  templateUrl: './register-loan.component.html',
  styleUrls: ['./register-loan.component.scss']
})
export class RegisterLoanComponent implements OnInit {

  name: string = "";
  isInvalidName :boolean = false;
  errorInputName: string = "";
  constructor(
    private dialog:MatDialog,
    private validation:ValidationsService,
    private AlertService:AlertService
    ) { }

  ngOnInit(): void {
  }
  updateValue(e){
     this.name = e.value;
  }

  save(){
    if(this.name == ''){
      this.isInvalidName = true;
      this.errorInputName = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.name,this.validation.AlphaNumericAndSpacePattern())){
      this.isInvalidName = true;
      this.errorInputName = "Solo se aceptan Carácteres Alfanúmerics";
    }else if(!this.validation.validateLength(this.name,15)){
      this.isInvalidName = true;
      this.errorInputName = "El nombre es muy extenso";
    }else{
       this.isInvalidName = false;
    }

    if(!this.isInvalidName ){
       this.AlertService.alertTimeCorrect("Se ha generado un prestamo de un activo",function(_component){
                               _component.name="";
                               _component.dialog.closeAll();
                     },this);
    }else{
      return;
    }
  }

}
