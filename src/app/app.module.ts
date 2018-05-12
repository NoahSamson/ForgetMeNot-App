import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import {SMS} from '@ionic-native/sms';


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
import {Camera} from '@ionic-native/camera';
import { PeoplePage } from '../pages/people/people';
//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LongPressModule } from 'ionic-long-press';

//export firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDPzDf5rnyf7T7GYveAEBtwPnP4D6qHHxo",
  authDomain: "fmn-sr.firebaseapp.com",
  databaseURL: "https://fmn-sr.firebaseio.com/",
  projectId: "fmn-sr",
  storageBucket: "fmn-sr.appspot.com",
  messagingSenderId: "741103811539"
};

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
    PeoplePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    LongPressModule
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
    PeoplePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    Camera,
    AngularFireDatabaseModule
    
  ]
})
export class AppModule {}
