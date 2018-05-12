// Security
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

//Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user.model';

//Pages
import { RegisterPage } from '../register/register';
import { UserPage } from '../user/user';
import { TabsPage } from './../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
  
})


export class LoginPage {
  alertCtrl: AlertController;
  // User Object
  user = {} as User;
  //Form Group
  public loginForm: FormGroup;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public formBuilder: FormBuilder, alertCtrl: AlertController) {
  //  This makes sure that the user has typed the email and passeword
    //validating Form 
    this.loginForm = formBuilder.group({
      eml: ['', Validators.required],
      pass: ['', Validators.required]
    });

    this.alertCtrl = alertCtrl; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegisterPage(){
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(RegisterPage);
  }

  //Logins the new user
   login(user: User) {
      this.authService.login(user.email, user.password).then(authData => {
        this.navCtrl.setRoot(TabsPage);
        let toast =this.toastCtrl.create({
          message: 'Welcome' ,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        user.email = user.password = '';
        
      }).catch(err => {
        //Security
        // The user will be given this alert if any error occurs in the login process
        let alert = this.alertCtrl.create({
          title: 'invalid' ,
          subTitle: 'Something went wrong, make sure you online and try again',
          buttons: ['OK']
        });
        alert.present();
      });
  }

  //To logout a user
  logout() {
    this.authService.logout();
  }

}
