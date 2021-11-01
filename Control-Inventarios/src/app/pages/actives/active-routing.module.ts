import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivesComponent } from './actives.component';
import { AddActiveComponent } from './add-active/add-active.component';
import { ViewActiveComponent } from './view-active/view-active.component';
const routes: Routes = [
  {
    path: '',
    component: ActivesComponent
  },
   {
    path: 'view/:idActive',
    component: ViewActiveComponent

   },
   {
    path: 'add',
    component: AddActiveComponent

   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveRoutingModule { }
