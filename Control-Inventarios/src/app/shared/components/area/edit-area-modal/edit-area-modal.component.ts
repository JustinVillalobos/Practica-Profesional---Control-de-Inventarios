import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
@Component({
  selector: 'app-edit-area-modal',
  templateUrl: './edit-area-modal.component.html',
  styleUrls: ['./edit-area-modal.component.scss']
})
export class EditAreaModalComponent implements OnInit {
  edificios= [
    {idEdifices:1,name:"Edificio 1",enabled:"true"},
    {idEdifices:2,name:"Edificio 2",enabled:"false"},
    {idEdifices:3,name:"Edificio 3",enabled:"true"},
    {idEdifices:4,name:"Edificio 4",enabled:"true"},
    {idEdifices:5,name:"Edificio 5",enabled:"true"},
    {idEdifices:6,name:"Edificio 6",enabled:"true"},
    {idEdifices:7,name:"Edificio 7",enabled:"true"},
    {idEdifices:8,name:"Edificio 8",enabled:"true"},
    {idEdifices:9,name:"Edificio 9",enabled:"true"},
    {idEdifices:10,name:"Edificio 10",enabled:"false"},
    {idEdifices:11,name:"Edificio 11",enabled:"true"},
  ];
  area = {
    idArea:0,
    name:"",
    edifice:"",
    isEnabled:true
  }
  isInvalidName :boolean = false;
  errorInputName: string = "";
   isInvalidEdifice :boolean = false;
  errorInputEdifice: string = "";
  constructor(
    private dialog:MatDialog,
    private validation:ValidationsService,
    private AlertService:AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.area.edifice = this.data.edifice
  }
  updateValue(e){
    if(e.name === 'name'){
      this.area.name = e.value;
    }else if(e.name === 'edifice'){
        this.area.edifice = e.value;
    }
  }
  saveArea(){
    if(this.area.name == ''){
      this.isInvalidName = true;
      this.errorInputName = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.area.name,this.validation.AlphaNumericAndSpacePattern())){
      this.isInvalidName = true;
      this.errorInputName = "Solo se aceptan Carácteres Alfabeticos";
    }else if(!this.validation.validateLength(this.area.name,15)){
      this.isInvalidName = true;
      this.errorInputName = "El nombre es muy extenso";
    }else{
       this.isInvalidName = false;
    }
     if(this.area.edifice == ''){
       this.isInvalidEdifice = true;
       this.errorInputEdifice = "Campo Vacío";
    }else{
        this.isInvalidEdifice = false;
    }
    if(!this.isInvalidName && !this.isInvalidEdifice){
       this.AlertService.alertTimeCorrect("Información guardada con éxito",function(_component){
                               _component.name="";
                               _component.edifice="";
                               _component.dialog.closeAll();
                     },this);
    }else{
      return;
    }
  }

}
