import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdificesComponent } from './edifices.component';
import { EdificesRoutingModule } from './edifices-routing.module';

import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  declarations: [
  EdificesComponent,
  ],
  imports: [
    CommonModule,
    EdificesRoutingModule,
    ComponentsModule,
    NgxSpinnerModule,
    NgxDatatableModule
  ]
})
export class EdificesModule { }
