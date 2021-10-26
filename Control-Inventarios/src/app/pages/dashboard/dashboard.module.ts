import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TopBarComponent } from 'src/app/shared/components/top-bar/top-bar.component';
import { LeftSideBarComponent } from 'src/app/shared/components/left-side-bar/left-side-bar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    TopBarComponent,
    LeftSideBarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
