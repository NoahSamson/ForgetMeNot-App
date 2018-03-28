import { Component } from '@angular/core';

//import pages

import { MapPage } from '../map/map';
import { MembersPage } from '../members/members'; 
import { UserPage } from '../user/user';
import { LifeStoryPage } from '../life-story/life-story';
import { GalleryPage } from '../gallery/gallery';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab0Root = UserPage;
  tab1Root = LifeStoryPage;
  tab2Root = GalleryPage;
  tab3Root = MembersPage;
  tab4Root = MapPage;

  
  constructor() {

  }
}
