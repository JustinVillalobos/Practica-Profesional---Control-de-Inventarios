import { Component, OnInit,NgZone  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from "@angular/router";
const electron = (<any>window).require('electron');
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  usernameValidationsClass:boolean = false;
  passwordValidationsClass:boolean = false;
  constructor(
    private router: Router,
    private _ngZone: NgZone,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ValidationsService:ValidationsService,
    private AlertService:AlertService,
    private spinner: NgxSpinnerService
    ) { 
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  goToDashBoard(){
     this._ngZone.run(()=>{
      this.router.navigate(['/dashboard']);
      });
  }
  verifyCredentials(){
    if(this.loginForm.valid){
      if(!this.ValidationsService.evaluateValue(
        this.loginForm.value.username,
        this.ValidationsService.AlphabeticPattern()) &&
        !this.ValidationsService.evaluateValue(
        this.loginForm.value.password,
        this.ValidationsService.PasswordPattern())){
         this.spinner.show();
          this.usernameValidationsClass = false;
          this.passwordValidationsClass = false;
          this.authService.login(this.loginForm.value.username,this.loginForm.value.password);
           electron.ipcRenderer.on("reply", (event: any, data: string) => {
                this.spinner.hide();
               if(data["res"]){
                 this.authService.setSession(data);
                this.goToDashBoard();
               }else{
                  this.AlertService.alertaError("Credenciales ingresadas no coinciden con ningún usuario");
               }
            });
      }else{
        if(!this.ValidationsService.evaluateValue(
        this.loginForm.value.username,
        this.ValidationsService.AlphabeticPattern())){
         this.usernameValidationsClass = false;
        }
        if(!this.ValidationsService.evaluateValue(
        this.loginForm.value.password,
        this.ValidationsService.AlphaNumericPattern())){
         this.passwordValidationsClass = false;
        }
      }
    }else{
      if(this.loginForm.value.username.length === 0){
        this.usernameValidationsClass = true;
      }
       if(this.loginForm.value.password.length === 0){
        this.passwordValidationsClass = true;
      }
    }
  }
  recoveryPassword(){

  }
  checkUserCharacter(e){
    if(this.ValidationsService.WordsAlphabeticValidation(e)){
      this.usernameValidationsClass = false;
    }else{
       this.usernameValidationsClass = true;
    }
  }
  checkPasswordCharacter(e){
    if(this.ValidationsService.passwordValidation(e)){
      this.passwordValidationsClass = false;
    }else{
       this.passwordValidationsClass = true;
    }
  }
  checkUserNameValidations(e){
     this.checkUserCharacter(e);
    let username= this.loginForm.controls.username.value;
    if(!this.ValidationsService.validateLength(username,15)){
       e.preventDefault();
    }
  }
  checkPasswordValidations(e){
    this.checkPasswordCharacter(e);
    let password= this.loginForm.controls.password.value;
    if(!this.ValidationsService.validateLength(password,15)){
        e.preventDefault();
    }
  }

}
