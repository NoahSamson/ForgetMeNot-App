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
  userRef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
    
    //Get the uid of the current User
    this.id = authService.getCurrentUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
        //Get the Firebase database reference of current User's Profile
        this.userRef = this.authService.getUserprofileRef(this.id);
        console.log(this.user);
  }

}
