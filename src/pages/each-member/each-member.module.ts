import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EachMemberPage } from './each-member';

@NgModule({
  declarations: [
    EachMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(EachMemberPage),
  ],
})
export class EachMemberPageModule {}
