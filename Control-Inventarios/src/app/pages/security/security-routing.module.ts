import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordComponent } from 'src/app/pages/security/change-password/change-password.component';
import { ChangeUserInfoComponent } from 'src/app/pages/security/change-user-info/change-user-info.component';
const routes: Routes = [
  {
    path: '',
    component: ChangeUserInfoComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
