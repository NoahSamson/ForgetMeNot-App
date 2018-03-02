import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LifeStoryPage } from './life-story';

@NgModule({
  declarations: [
    LifeStoryPage,
  ],
  imports: [
    IonicPageModule.forChild(LifeStoryPage),
  ],
})
export class LifeStoryPageModule {}
