import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { MaterialsModule } from "src/app/materials.module";


import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AreaComponent } from './area.component';
import { AddAreaModalComponent } from 'src/app/shared/components/area/add-area-modal/add-area-modal.component';
import { EditAreaModalComponent } from 'src/app/shared/components/area/edit-area-modal/edit-area-modal.component';
@NgModule({
  declarations: [
    AreaComponent,
    AddAreaModalComponent,
    EditAreaModalComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,
    MaterialsModule,
    ComponentsModule,
    NgxSpinnerModule,
    NgxDatatableModule
  ]
})
export class AreaModule { }
