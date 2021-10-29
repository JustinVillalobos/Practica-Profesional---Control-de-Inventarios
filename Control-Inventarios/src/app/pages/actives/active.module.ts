import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivesComponent } from './actives.component';
import { ActiveRoutingModule } from './active-routing.module';

import { MaterialsModule } from "src/app/materials.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
      ActivesComponent,
  ],
  imports: [
    CommonModule,
    ActiveRoutingModule,
    MaterialsModule,
    ComponentsModule,
    NgxSpinnerModule,
    NgxDatatableModule
  ]
})
export class ActiveModule { }
