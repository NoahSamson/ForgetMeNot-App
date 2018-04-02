import { Component , NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { firebaseConfig } from "../../app/app.module";
import {storage} from 'firebase';
import firebase from 'firebase';
import { LoginPage } from '../login/login';

import { AngularFireAuth } from "AngularFire2/auth";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserPage } from '../user/user';
import { AngularFireDatabase } from "angularfire2/database";
import { User } from '../../models/user.model';
import { App } from 'ionic-angular';



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
  providers: [AngularFireAuth]
})
export class RegisterPage {

  //captureDataUrl: string;
  alertCtrl: AlertController;
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public imageSrc: string;
  public loading:Loading;
  
  
  user = {} as User;


  constructor(private app:App, private firebaseAuth: AngularFireAuth, private camera : Camera ,public navCtrl: NavController,
    alertCtrl: AlertController, public navParams: NavParams , public toastCtrl: ToastController,  
    public zone:NgZone,public loadingCtrl: LoadingController, firebasedb : AngularFireDatabase, public authService: AuthServiceProvider) {
    this.myPhotosRef = firebase.storage().ref(); 
    this.alertCtrl =  alertCtrl;


   
  }
  
  //Gets called when the page loads
  ionViewDidLoad() {
    //shows that the page was loaded
    console.log('ionViewDidLoad RegisterPage');
  }

 async takePhoto() {
      const options : CameraOptions = {
        quality : 50 ,
        targetHeight : 600,
        targetWidth  :600,
        destinationType : this.camera.DestinationType.DATA_URL,
        encodingType : this.camera.EncodingType.JPEG,
        mediaType : this.camera.MediaType.PICTURE
      }

      const result = await this.camera.getPicture(options);
      const image = `data:images/jpeg;base64,${result}`;
      const pictures = storage().ref();
      pictures.putString(image,'data_url');
  }

 
 

  uploadDb(savedPicture){
      var ref = firebase.database().ref('assets');

      return new Promise((resolve,reject)=> {
        var dataTosave = {
          'URL' : savedPicture.downloadURL,
          'name' : savedPicture.metadata.name,

        };

        ref.push(dataTosave);

      });
  }


 


  


  showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      title: 'Uploaded!',
      subTitle: 'Picture is uploaded to Firebase',
      buttons: ['OK']
    });
    alert.present();

    // clear the previous photo data in the variable
    this.imageSrc = "";
    
  }

   presentLoadingText() {
    
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Uploading image'
    });

    this.loading.present();
    
  } 

 

  
  /**
   * Register the user
   */


    //Switch between the email and password part and the user details part when registering
    test(){
      document.getElementById("regForm").style.display="none";
      document.getElementById("otherDetails").style.display="block";
       
    }
    
    //Gets called if the user selected caretaker 
    radioCheckedCaretaker(){
      document.getElementById("caretakerInfo").style.display="none";
      validateRadio=true;
    }

    //Gets called if the user selected Patient
    radioCheckedPatient(){
      document.getElementById("caretakerInfo").style.display="block";
      
    }

  //to make sure the user select either patient or caretaker. And show a warning
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Please select a role',
      subTitle: '',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  //Register the user using the user object populated with details from the user
  async signup(user: User) {
   await this.uploadProfPic();
    this.authService.signupService(user).then(authData => {
    this.logout();
    }) ;
  }

  capture() {
    // properties for the picture to be captured
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation : true
    };
    
    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      document.getElementById('icon').style.display="none"
      document.getElementById('picButtons').style.display="none"

      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     console.log(err);
    });
  }

  browsePhone(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      document.getElementById('icon').style.display="none"
      document.getElementById('picButtons').style.display="none"
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
 
  }

 async uploadProfPic(){
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = await storageRef.child(`UserProfilePic/${filename}.jpg`);
    await imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
      // Do something here when the data is succesfully uploaded!
       this.user.profilePic= snapshot.downloadURL;
      }); 
  }

  cancelUpload(){
    document.getElementById('icon').style.display="block"
    document.getElementById('picButtons').style.display="block"
    this.imageSrc="";
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


  logout() {
    this.authService.logout().then(() => {
      this.app.getRootNav().setRoot(LoginPage);
    }).catch(function(error){
       console.log(error);
     });;
  }
}
