import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Interceptors
import { AuthInterceptor } from 'src/app/shared/services/auth/AuthInterceptor';
import { AuthGuardService } from 'src/app/shared/services/auth/auth-guard.service';

import { DashboardModule } from './pages/dashboard/dashboard.module';

import { LoginModule } from './pages/auth/login.module';

import { EdificesModule } from './pages/edifices/edifices.module';


import { AreaModule } from './pages/area/area.module';

import { ActiveModule } from './pages/actives/active.module';
import { SecurityModule } from './pages/security/security.module';
import { ReportsComponent } from './pages/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    LoginModule,
    EdificesModule,
    AreaModule,
    ActiveModule,
    SecurityModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
