import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/services/auth/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/auth/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad:[AuthGuardService]
  },
  {
    path: 'edifices',
    loadChildren: () => import('./pages/edifices/edifices.module').then(m => m.EdificesModule),
    canLoad:[AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
