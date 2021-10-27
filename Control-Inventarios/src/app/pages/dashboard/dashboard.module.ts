import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialsModule } from "src/app/materials.module";

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TopBarComponent } from 'src/app/shared/components/top-bar/top-bar.component';
import { LeftSideBarComponent } from 'src/app/shared/components/left-side-bar/left-side-bar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    TopBarComponent,
    LeftSideBarComponent,
    FooterComponent,
    InputFormComponent
  ],
  imports: [
    CommonModule,
    MaterialsModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DashboardModule { }
