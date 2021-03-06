import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//map imports
import { Geolocation } from '@ionic-native/geolocation';
import {SMS} from '@ionic-native/sms';
//import { GeolocationMarker } from 'geolocation-marker';
//import { Marker } from '@ionic-native/google-maps';

//page imports
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MembersPage } from '../pages/members/members';
import { RegisterPage } from '../pages/register/register';

import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { EachMemberPage } from '../pages/each-member/each-member';
import { GalleryPage } from '../pages/gallery/gallery';
import { LifeStoryPage } from '../pages/life-story/life-story';
import { UserPage } from '../pages/user/user';
import { PeoplePage } from '../pages/people/people';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//gallery imports
import {Camera} from '@ionic-native/camera';
import { LongPressModule } from 'ionic-long-press';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AngularFireDatabaseModule } from 'angularfire2/database';

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
    MapPage,
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
    AngularFireDatabaseModule,
    //Geolocation,
    SMS   
  ]
})
export class AppModule {}
