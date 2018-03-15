import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

//import Model
import { User } from '../../models/user.model';
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
  id: any;
  user = {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
    this.id = authService.getCurrentUser();
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');

  }

  getUserData(){
    this.user = this.authService.getDatabaseRef().ref('/users/' + this.id);
    
  }

}
