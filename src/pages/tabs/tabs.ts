import { Component } from '@angular/core';

//import pages
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';

import { MapPage } from '../map/map';
import { MembersPage } from '../members/members'; 

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  //tab1Root = HomePage;
  tab1Root = LoginPage;
  tab2Root = AboutPage;
  tab3Root = MembersPage;
  tab4Root = MapPage;
  constructor() {

  }
}
