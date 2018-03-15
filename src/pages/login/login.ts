import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user.model';

//Pages
import { RegisterPage } from '../register/register';
import { UserPage } from '../user/user';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // email: string;
  // password: string;

  user = {} as User;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
   

  }

  goToRegisterPage(){
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(RegisterPage);
  }

   login(user: User) {
      this.authService.login(user.email, user.password).then(authData => {
        this.navCtrl.push(UserPage);
        let toast =this.toastCtrl.create({
          message: 'Welcome' + this.authService.getCurrentUser(),
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        user.email = user.password = '';
        
      }) ;
      

  }

  logout() {
    this.authService.logout();
  }

}
