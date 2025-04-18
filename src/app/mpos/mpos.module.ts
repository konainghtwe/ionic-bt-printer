import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MposPageRoutingModule } from './mpos-routing.module';

import { MposPage } from './mpos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MposPageRoutingModule
  ],
  declarations: [MposPage]
})
export class MposPageModule {}
