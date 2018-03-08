import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user.model';


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

  // fName: string;
  // lName: string;
  // email: string;
  // Address: string;
  // pNum: string;
  // password: string;

  user = {} as User;


  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
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
    
  }

  signup(user: User) {
    this.authService.signup(user.email, user.password);
    user.email = user.password = '';
  }

}
