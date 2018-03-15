import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Patient } from '../../models/Patient';
import { AngularFireAuth } from "AngularFire2/auth";
import { HomePage } from '../home/home';
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
  providers: [AngularFireAuth]
})


export class LoginPage {
  
  //email : string;
 // password : string;

 user = {} as Patient;


  constructor( private firebaseAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegisterPage(){
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(RegisterPage);
  }

  /*signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
  }
  */
  
  async login(user: Patient) {
      
    await this.firebaseAuth.auth.signInWithEmailAndPassword(user.email,user.password).then(value =>{
      this.navCtrl.setRoot(UserPage);
    });
   // this.user.email=this.user.password = '';
  }

  logout() {
    this.authService.logout();
  }

}
