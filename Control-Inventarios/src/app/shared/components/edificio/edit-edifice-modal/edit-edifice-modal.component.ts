import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
@Component({
  selector: 'app-edit-edifice-modal',
  templateUrl: './edit-edifice-modal.component.html',
  styleUrls: ['./edit-edifice-modal.component.scss']
})
export class EditEdificeModalComponent implements OnInit {
  name: string = "";
  isInvalidName :boolean = false;
  errorInputName: string = "";
   constructor(
    private dialog:MatDialog,
    private validation:ValidationsService,
    private AlertService:AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.name = this.data.name;
  }
  updateValue(e){
      this.name = e.value;
  }
    saveArea(){
    if(this.name == ''){
      this.isInvalidName = true;
      this.errorInputName = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.name,this.validation.AlphaNumericAndSpacePattern())){
      this.isInvalidName = true;
      this.errorInputName = "Solo se aceptan Carácteres Alfabeticos";
    }else if(!this.validation.validateLength(this.name,15)){
      this.isInvalidName = true;
      this.errorInputName = "El nombre es muy extenso";
    }else{
       this.isInvalidName = false;
    }

    if(!this.isInvalidName ){
       this.AlertService.alertTimeCorrect("Información guardada con éxito",function(_component){
                               _component.name="";
                               _component.dialog.closeAll();
                     },this);
    }else{
      return;
    }
  }

}
