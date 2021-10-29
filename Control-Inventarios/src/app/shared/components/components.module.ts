import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialsModule } from "src/app/materials.module";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TopBarComponent } from 'src/app/shared/components/top-bar/top-bar.component';
import { LeftSideBarComponent } from 'src/app/shared/components/left-side-bar/left-side-bar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';


@NgModule({
  declarations: [
    HeaderComponent,
    TopBarComponent,
    LeftSideBarComponent,
    FooterComponent,
    InputFormComponent,
  ],
  imports:[
    CommonModule,
    MaterialsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
   HeaderComponent,
    TopBarComponent,
    LeftSideBarComponent,
    FooterComponent,
    InputFormComponent,
  ]
})
export class ComponentsModule { }
