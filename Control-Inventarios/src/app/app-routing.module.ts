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
  },
  {
    path: 'areas',
    loadChildren: () => import('./pages/area/area.module').then(m => m.AreaModule),
    canLoad:[AuthGuardService]
  },
  {
    path: 'actives',
    loadChildren: () => import('./pages/actives/active.module').then(m => m.ActiveModule),
    canLoad:[AuthGuardService]
  },
  {
    path: 'security',
    loadChildren: () => import('./pages/security/security.module').then(m => m.SecurityModule),
    canLoad:[AuthGuardService]
  },
   {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule),
    canLoad:[AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
