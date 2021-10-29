import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from "src/app/materials.module";
import { EdificesComponent } from './edifices.component';
import { EdificesRoutingModule } from './edifices-routing.module';

import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AddEdificeModalComponent } from 'src/app/shared/components/edificio/add-edifice-modal/add-edifice-modal.component';
import { EditEdificeModalComponent } from 'src/app/shared/components/edificio/edit-edifice-modal/edit-edifice-modal.component';

@NgModule({
  declarations: [
  EdificesComponent,
  AddEdificeModalComponent,
  EditEdificeModalComponent
  ],
  imports: [
    CommonModule,
    EdificesRoutingModule,
    MaterialsModule,
    ComponentsModule,
    NgxSpinnerModule,
    NgxDatatableModule
  ]
})
export class EdificesModule { }
