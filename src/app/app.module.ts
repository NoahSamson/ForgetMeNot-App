import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';

//page imports
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { MembersPage } from '../pages/members/members';
import { RegisterPage } from '../pages/register/register';

import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { EachMemberPage } from '../pages/each-member/each-member';
import { GalleryPage } from '../pages/gallery/gallery';
import { LifeStoryPage } from '../pages/life-story/life-story';
import { UserPage } from '../pages/user/user';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    LoginPage,
    MembersPage,
    MapPage,
    RegisterPage,
    EachMemberPage,
    GalleryPage,
    LifeStoryPage,
    UserPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    MapPage,
    ContactPage,
    LoginPage,
    MembersPage,
    RegisterPage,
    EachMemberPage,
    GalleryPage,
    LifeStoryPage,
    UserPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
