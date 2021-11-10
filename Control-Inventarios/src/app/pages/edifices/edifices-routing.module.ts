import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EdificesComponent } from './edifices.component';
const routes: Routes = [

   {
    path: '',
    component: EdificesComponent,
    children: [
      {
        path: 'edifices',
        children: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdificesRoutingModule { }
