import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from 'src/app/pages/auth/login/login.component';
import { MaterialsModule } from "src/app/materials.module";
import { RecoveryPasswordComponent } from 'src/app/shared/components/recovery-password/recovery-password.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    LoginComponent,
    RecoveryPasswordComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    MaterialsModule,
    NgxSpinnerModule,
    ComponentsModule
  ]
})
export class LoginModule { }
