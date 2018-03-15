import { Component } from '@angular/core';

//import pages
import { LoginPage } from '../login/login';

import { MapPage } from '../map/map';
import { MembersPage } from '../members/members'; 
import { UserPage } from '../user/user';
import { LifeStoryPage } from '../life-story/life-story';
import { GalleryPage } from '../gallery/gallery';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab0Root = UserPage;
  tab2Root = LifeStoryPage;
  tab3Root = GalleryPage;
  tab4Root = MembersPage;
  tab5Root = MapPage;

  
  constructor() {

  }
}
