import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  test(){
    document.getElementById("regForm").style.display="none";
     document.getElementById("profilePic").style.display="block";
     document.getElementById("btnRegister").style.display="block";
     
     document.getElementById("btnNext").style.display="none";
     
  }
  radioChecked(){
    document.getElementById("profilePic").style.display="block";
    document.getElementById("caretakerInfo").style.display="block";
  //document.getElementById("picUpload").style.display="block";
  }

}
