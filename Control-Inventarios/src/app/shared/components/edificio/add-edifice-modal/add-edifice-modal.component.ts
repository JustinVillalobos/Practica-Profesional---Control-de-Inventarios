import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
const electron = (<any>window).require('electron');
import { EdificeService } from 'src/app/shared/services/edifice.service';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
@Component({
  selector: 'app-add-edifice-modal',
  templateUrl: './add-edifice-modal.component.html',
  styleUrls: ['./add-edifice-modal.component.scss']
})
export class AddEdificeModalComponent implements OnInit {

  edifice: EdificeModel = {
    idEdifice:0,
    name:  ""
  };
  isInvalidName :boolean = false;
  errorInputName: string = "";
  constructor(
    private dialog:MatDialog,
    private spinner: NgxSpinnerService,
    private validation:ValidationsService,
    private AlertService:AlertService,
     private EdificeService:EdificeService
    ) { }

  ngOnInit(): void {
  }
  updateValue(e){
     this.edifice.name = e.value;
  }
  save(){    
    if(this.edifice.name == ''){
      this.isInvalidName = true;
      this.errorInputName = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.edifice.name,this.validation.AlphaNumericAndSpacePattern())){
      this.isInvalidName = true;
      this.errorInputName = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.edifice.name,125)){
      this.isInvalidName = true;
      this.errorInputName = "El nombre es muy extenso";
    }else{
       this.isInvalidName = false;
    }

    if(!this.isInvalidName ){
      this.spinner.show();
      this.EdificeService.addEdifice(this.edifice);
       electron.ipcRenderer.on("addEdifice", (event: any, data: any) => {
                if(data["res"]){ 
                this.spinner.hide(); 
                   this.AlertService.alertTimeCorrect("Información guardada con éxito",function(_component){
                                           _component.edifice.name="";
                                           _component.dialog.closeAll();
                                 },this);
                 }
            });
    }else{
      return;
    }
  }
}
