import { Component , NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { firebaseConfig } from "../../app/app.module";
import {storage} from 'firebase';
import firebase from 'firebase';
import { GalleryPage } from '../gallery/gallery';

import { AngularFireAuth } from "AngularFire2/auth";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserPage } from '../user/user';
import { AngularFireDatabase } from "angularfire2/database";
import { User } from '../../models/user.model';



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


  constructor( private firebaseAuth: AngularFireAuth, private camera : Camera ,public navCtrl: NavController,
    alertCtrl: AlertController, public navParams: NavParams , public toastCtrl: ToastController,  
    public zone:NgZone,public loadingCtrl: LoadingController, firebasedb : AngularFireDatabase, public authService: AuthServiceProvider) {
    this.myPhotosRef = firebase.storage().ref('/Photos/myphoto'); 
    this.alertCtrl =  alertCtrl;


   
  }
  

 

  

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
    this.authService.signupService(user).then(authData => {
      this.navCtrl.push(UserPage);
      let toast =this.toastCtrl.create({
        message: 'Welcome '+ user.firstName,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      user.email = user.password = '';
      
    }) ;
  }
  
  radioCheckedPatient(){
    document.getElementById("caretakerInfo").style.display="block";
    this.display();
  //document.getElementById("picUpload").style.display="block";
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
      const pictures = storage().ref('pictures/myPhoto');
      pictures.putString(image,'data_url');
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
  private uploadPhoto(): void {
    this.myPhotosRef
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture :any) => {
        this.myPhotoURL = savedPicture.downloadURL;

        
      });
      console.log(this.myPhotoURL);
      this.display();

     
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

  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  display(){
    firebase.storage().ref('/Photos/myphoto').getDownloadURL().then((url) =>  {
        this.zone.run(() => {
          this.imageSrc = url;
          console.log(url);
        })
    })
    
  }

  capture() {
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
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  upload() {
    this.presentLoadingText();
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);

    imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
     // Do something here when the data is succesfully uploaded!
     this.uploadDb(snapshot);
      this.showSuccesfulUploadAlert();
    });

  }

  showSuccesfulUploadAlert() {
    this.loading.dismiss();
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

     /* async register (pro : Profile) {
   try {  
   const result =  await this.firebaseAuth.auth.createUserWithEmailAndPassword(pro.email,pro.password);
    console.log(result);
   }
   catch (e){
      console.log(e);
   }
  }

  */
  
  //   document.getElementById("btnNext").style.bottom= "-40px";
  //   validateRadio=true;

  // }

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
