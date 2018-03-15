import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
<<<<<<< HEAD
import { Patient } from "../../src/models/Patient";
import { Profile } from "../../src/models/Profile";
import { AngularFireDatabaseModule  } from "angularfire2/database";

=======
import { Geolocation } from '@ionic-native/geolocation';
>>>>>>> 33450c3d258024446354e17d3db2a1ccb2590e4c

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
//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//export firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCtsIcBb0zUkS-x4egUf5fNNqn4A8khLkI",
<<<<<<< HEAD
  authDomain: "forgetmenot-7b63c.firebaseapp.com",
  databaseURL: "https://forgetmenot-7b63c.firebaseio.com",
  projectId: "forgetmenot-7b63c",
  storageBucket: "forgetmenot-7b63c.appspot.com",
  messagingSenderId: "852502676925"
=======
    authDomain: "forgetmenot-7b63c.firebaseapp.com",
    databaseURL: "https://forgetmenot-7b63c.firebaseio.com",
    projectId: "forgetmenot-7b63c",
    storageBucket: "forgetmenot-7b63c.appspot.com",
    messagingSenderId: "852502676925"
>>>>>>> 33450c3d258024446354e17d3db2a1ccb2590e4c
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
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    Camera,
    AngularFireDatabaseModule
    
  ]
})
export class AppModule {}
