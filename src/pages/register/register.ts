import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user.model';

import { AlertController } from 'ionic-angular';

var validateRadio;
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;


  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public  alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  test(){
    document.getElementById("regForm").style.display="none";
    document.getElementById("otherDetails").style.display="block";

    // if(validateRadio){
    
    // }
    // else{
    //     this.presentAlert();
    // }
     
     
  }

  signup(user: User) {
    // this.authService.signup(user.email, user.password);
    // user.email = user.password = '';
    // this.test();
    this.authService.signupService(user);
  }
  
  radioCheckedPatient(){
    document.getElementById("caretakerInfo").style.display="block";
    document.getElementById("btnNext").style.bottom= "-40px";
    validateRadio=true;

  }

  radioCheckedCaretaker(){
    document.getElementById("caretakerInfo").style.display="none";
    validateRadio=true;

  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Please select a role',
      subTitle: '',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
