import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, private toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');

  }

}
