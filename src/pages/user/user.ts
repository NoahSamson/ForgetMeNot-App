import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController,AlertController,Loading,LoadingController, NavParams, IonicApp } from 'ionic-angular';
import * as firebase from 'firebase'; 
import { Camera, CameraOptions } from '@ionic-native/camera';
import { App } from 'ionic-angular';
import { PeoplePage } from './../people/people';
//auth Service
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

//import Model
import { User } from '../../models/user.model';
import { LoginPage } from '../login/login';
import { variable } from '@angular/compiler/src/output/output_ast';
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

  public currentuser: any;
  public user = {} as User;
  public imageSrc:any;
  loading:Loading;
  alertCtrl: AlertController;

  constructor(public loadingCtrl: LoadingController,private camera : Camera ,public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public app: App) {
    this.currentuser = authService.getCurrentUser();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');

    const personRef: firebase.database.Reference = firebase.database().ref('/users/' + this.currentuser);

    personRef.on('value', personSnapshot => {
       this.user = personSnapshot.val();
    });

    console.log(this.user);

  }
 
  //get the pic from the phone
 edit(){
  this.camera.getPicture({
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    quality: 100,
    encodingType: this.camera.EncodingType.PNG,
  }).then(imageData => {
    this.imageSrc = 'data:image/jpeg;base64,' + imageData;
  }, error => {
    console.log("ERROR -> " + JSON.stringify(error));
  });
}

presentLoadingDefault() {
  this.loading= this.loadingCtrl.create({
     spinner: 'bubbles',
     content: 'Please wait...'
   });
   this.loading.present();
   setTimeout(() => {
     //clears the dismiss after 5secs  
   }, 5000);
 }

async upload() {
  let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = await storageRef.child(`UserProfilePic/${filename}.jpg`);
    //this.presentLoadingDefault();
    await imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
     //assign the snapshot value to the user.profilepic
      this.user.profilePic= snapshot.downloadURL;
      console.log( snapshot.downloadURL);
      //New image to be updated
      var userData={
        'URL': snapshot.downloadURL,
        'address':"bee" //testing:to chk if it is getting updated
      }
     
      //get the reference location of the user to be updated
      var ref= firebase.database().ref('users/').child(this.currentuser);
      ref.once('value', function(snapshot){
        //if the particular child doesnt exist
         if(snapshot.val()===null){
             this.showSuccesfulUploadAlert('Something went wrong','');
             console.log("1")
         }
         //if it exists update the data
         else{
           ref.update(userData); 
           //this.navCtrl.push(UserPage);
           console.log("2")
         }
      })
    });

    
    }

//cancels the pic selected
cancelUpload(){
 
  this.imageSrc="";
}

  logout() {
    this.authService.logout().then(() => {
      this.app.getRootNav().setRoot(LoginPage);
    }).catch(function(error){
       console.log(error);
     });;
  }

  peopleMet(){
    this.navCtrl.push(PeoplePage);
  }

  showSuccesfulUploadAlert(Title) {
    let alert = this.alertCtrl.create({
      title:Title ,
      buttons: ['OK']
    });
    alert.present();
    // clear the previous photo data in the variable
    this.imageSrc = "";   
  }

}