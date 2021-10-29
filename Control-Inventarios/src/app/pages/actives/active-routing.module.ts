import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivesComponent } from './actives.component';
const routes: Routes = [
  {
    path: '',
    component: ActivesComponent,
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
export class ActiveRoutingModule { }
