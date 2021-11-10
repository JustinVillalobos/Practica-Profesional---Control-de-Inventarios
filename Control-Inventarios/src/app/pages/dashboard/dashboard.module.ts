import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from "src/app/materials.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';



@NgModule({
  declarations: [
    DashboardComponent, 
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    NgxSpinnerModule
  ]
})
export class DashboardModule { }
