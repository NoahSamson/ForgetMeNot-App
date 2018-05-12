import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicApp } from 'ionic-angular';
import * as firebase from 'firebase'; 
import { App } from 'ionic-angular';
import { PeoplePage } from './../people/people';
//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

//import Model
import { User } from '../../models/user.model';
import { LoginPage } from '../login/login';
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  public currentuser: any;
  public user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public app: App) {
    this.currentuser = authService.getCurrentUser();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');

    const personRef: firebase.database.Reference = firebase.database().ref('/users/' + this.currentuser);

    personRef.on('value', personSnapshot => {
       this.user = personSnapshot.val();
    });

    console.log(this.user);

  }
 

  logout() {
    this.authService.logout().then(() => {
      this.app.getRootNav().setRoot(LoginPage);
    }).catch(function(error){
       console.log(error);
     });;
  }

  peopleMet(){
    this.navCtrl.push(PeoplePage);
  }

}