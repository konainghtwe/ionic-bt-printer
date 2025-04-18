import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MposPage } from './mpos.page';

const routes: Routes = [
  {
    path: '',
    component: MposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MposPageRoutingModule {}
