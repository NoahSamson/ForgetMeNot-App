import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public  alertCtrl: AlertController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  test(){
    if(validateRadio){
    document.getElementById("regForm").style.display="none";
     document.getElementById("otherDetails").style.display="block";
     document.getElementById("btnRegister").style.display="block";
    }
    else{
        this.presentAlert();
    }
     
     
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
