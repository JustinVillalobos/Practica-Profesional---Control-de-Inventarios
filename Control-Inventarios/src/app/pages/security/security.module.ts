import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { ChangePasswordComponent } from 'src/app/pages/security/change-password/change-password.component';
import { ChangeUserInfoComponent } from 'src/app/pages/security/change-user-info/change-user-info.component';
import { RecoveryPasswordComponent } from 'src/app/shared/components/recovery-password/recovery-password.component';
import { MaterialsModule } from "src/app/materials.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  declarations: [
        RecoveryPasswordComponent,
        ChangePasswordComponent,
        ChangeUserInfoComponent,
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    MaterialsModule,
    ComponentsModule,
    NgxSpinnerModule,
    NgxDatatableModule
  ]
})
export class SecurityModule { }
