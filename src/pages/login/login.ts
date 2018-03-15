<<<<<<< HEAD
import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Patient } from '../../models/Patient';
import { AngularFireAuth } from "AngularFire2/auth";
import { HomePage } from '../home/home';
=======
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user.model';

//Pages
import { RegisterPage } from '../register/register';
>>>>>>> 33450c3d258024446354e17d3db2a1ccb2590e4c
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
<<<<<<< HEAD
  
  //email : string;
 // password : string;

 user = {} as Patient;


  constructor( private firebaseAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
=======
  // email: string;
  // password: string;

  user = {} as User;

  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
>>>>>>> 33450c3d258024446354e17d3db2a1ccb2590e4c
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegisterPage(){
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(RegisterPage);
  }

<<<<<<< HEAD
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
=======
   login(user: User) {
      this.authService.login(user.email, user.password).then(authData => {
        this.navCtrl.push(HomePage);
        let toast =this.toastCtrl.create({
          message: 'Welcome',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        user.email = user.password = '';
        
      }) ;
      

>>>>>>> 33450c3d258024446354e17d3db2a1ccb2590e4c
  }

  logout() {
    this.authService.logout();
  }

}
