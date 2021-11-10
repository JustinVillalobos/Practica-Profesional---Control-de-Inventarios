import { Component, OnInit, ViewChild,ElementRef, Renderer2,NgZone } from '@angular/core';
import { ActiveService } from 'src/app/shared/services/active.service';
const electron = (<any>window).require('electron');
import {Router} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
@Component({
  selector: 'app-edit-active',
  templateUrl: './edit-active.component.html',
  styleUrls: ['./edit-active.component.scss']
})
export class EditActiveComponent implements OnInit {

  @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  active = {
    idActive:0,
    name:"",
    licensePlate:"",
    amount:1,
    description:"",
    placeOrigin:"",
    mark:"",
    model:"",
    serie:"",
    isLoan:false
  }
  activeControls ={
    name:{error:"",isInvalid:false},
    licensePlate:{error:"",isInvalid:false},
    description:{error:"",isInvalid:false},
    placeOrigin:{error:"",isInvalid:false},
    mark:{error:"",isInvalid:false},
    model:{error:"",isInvalid:false},
    serie:{error:"",isInvalid:false},
  }
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private validation:ValidationsService,
     private AlertService:AlertService,
     private _router:Router,
    private _ngZone:NgZone,
    private ActiveService:ActiveService,
    ) {}


  ngOnInit(): void {
    this.active =JSON.parse(localStorage.getItem("active"));
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
    if(e.name =='amount'){
      this.active.amount = e.value;
    }else if(e.name =='description'){
      this.active.description = e.value;
    }else if(e.name =='licensePlate'){
      this.active.licensePlate = e.value;
    }else if(e.name =='mark'){
      this.active.mark = e.value;
    }else if(e.name =='model'){
      this.active.model = e.value;
    }else if(e.name =='serie'){
      this.active.serie = e.value;
    }else if(e.name =='placeOrigin'){
      this.active.placeOrigin = e.value;
    }else if(e.name =='name'){
      this.active.name = e.value;
    }
  }
  previous(){
     this._ngZone.run(()=>{
      this._router.navigate(['/view',this.active.idActive]);
     });
  }
   save(){
     if(this.active.name == ''){
      this.activeControls.name.isInvalid = true;
      this.activeControls.name.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.active.name,this.validation.AlphaNumericAndSpacePattern())){
      this.activeControls.name.isInvalid = true;
      this.activeControls.name.error = "Solo se aceptan Carácteres Alfanúmerics";
    }else if(!this.validation.validateLength(this.active.name,150)){
      this.activeControls.name.isInvalid = true;
      this.activeControls.name.error= "El nombre es muy extenso";
    }else{
       this.activeControls.name.isInvalid = false;
    }

    if(this.active.licensePlate == ''){
      this.activeControls.licensePlate.isInvalid = false;
    }else if(this.validation.evaluateValue(this.active.licensePlate,this.validation.AlphaNumericAndSpacePattern())){
      this.activeControls.licensePlate.isInvalid = true;
      this.activeControls.licensePlate.error = "Solo se aceptan Carácteres Alfanúmerics";
    }else if(!this.validation.validateLength(this.active.licensePlate,100)){
      this.activeControls.licensePlate.isInvalid = true;
      this.activeControls.licensePlate.error= "El nombre es muy extenso";
    }else{
       this.activeControls.licensePlate.isInvalid = false;
    }

    if(this.active.description == ''){
      this.activeControls.description.isInvalid = true;
      this.activeControls.description.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.active.description,this.validation.MixtAltPattern())){
      this.activeControls.description.isInvalid = true;
      this.activeControls.description.error = "Solo se aceptan Carácteres Alfanúmericos y comas";
    }else if(!this.validation.validateLength(this.active.description,300)){
      this.activeControls.description.isInvalid = true;
      this.activeControls.description.error= "El nombre es muy extenso";
    }else{
       this.activeControls.description.isInvalid = false;
    }

    if(this.active.placeOrigin == ''){
      this.activeControls.placeOrigin.isInvalid = true;
      this.activeControls.placeOrigin.error = "Campo Vacío";
    }else if(this.validation.evaluateValue(this.active.placeOrigin,this.validation.MixtPattern())){
      this.activeControls.placeOrigin.isInvalid = true;
      this.activeControls.placeOrigin.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.active.placeOrigin,150)){
      this.activeControls.placeOrigin.isInvalid = true;
      this.activeControls.placeOrigin.error= "El nombre es muy extenso";
    }else{
       this.activeControls.placeOrigin.isInvalid = false;
    }

    if(this.active.mark == ''){
       this.activeControls.mark.isInvalid = false;
    }else if(this.validation.evaluateValue(this.active.mark,this.validation.AlphaNumericAndSpacePattern())){
      this.activeControls.mark.isInvalid = true;
      this.activeControls.mark.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.active.mark,50)){
      this.activeControls.mark.isInvalid = true;
      this.activeControls.mark.error= "El nombre es muy extenso";
    }else{
       this.activeControls.mark.isInvalid = false;
    }

    if(this.active.model == ''){
       this.activeControls.model.isInvalid = false;
    }else if(this.validation.evaluateValue(this.active.model,this.validation.AlphaNumericAndSpacePattern())){
      this.activeControls.model.isInvalid = true;
      this.activeControls.model.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.active.model,50)){
      this.activeControls.model.isInvalid = true;
      this.activeControls.model.error= "El nombre es muy extenso";
    }else{
       this.activeControls.model.isInvalid = false;
    }

    if(this.active.serie == ''){
       this.activeControls.serie.isInvalid = false;
    }else if(this.validation.evaluateValue(this.active.serie,this.validation.AlphaNumericAndSpacePattern())){
      this.activeControls.serie.isInvalid = true;
      this.activeControls.serie.error = "Solo se aceptan Carácteres Alfanúmericos";
    }else if(!this.validation.validateLength(this.active.serie,50)){
      this.activeControls.serie.isInvalid = true;
      this.activeControls.serie.error= "El nombre es muy extenso";
    }else{
       this.activeControls.serie.isInvalid = false;
    }

    if(this.isValid()){
      this.spinner.show();
      console.log(this.active);
      this.ActiveService.editActive(this.active);
       electron.ipcRenderer.on("editActive", (event: any, data: any) => {
               console.log(data);
                if(data["res"]){ 
                   this.spinner.hide();
                   this.AlertService.alertTimeCorrect("Información guardada con éxito",function(_component){
                                           _component.redirectTo();
                                 },this);
                      }
       });
    }else{
    }
  }
    redirectTo(){
       this._ngZone.run(()=>{
      this._router.navigate(['/view',this.active.idActive]);
     });
    }
    isValid(){
      return !this.activeControls.serie.isInvalid &&
             !this.activeControls.model.isInvalid &&
             !this.activeControls.mark.isInvalid &&
             !this.activeControls.placeOrigin.isInvalid &&
             !this.activeControls.licensePlate.isInvalid &&
             !this.activeControls.description.isInvalid &&
             !this.activeControls.name.isInvalid ;
    }

}
