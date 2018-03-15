import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {storage} from 'firebase';
import firebase from 'firebase';
/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
  
})
export class GalleryPage {
  public myPhotosRef: any;
  public imageSrc: string;
  public loading:Loading;
  public alertCtrl: AlertController;
  assetCollection:any;

  constructor(private camera:Camera,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, alertCtrl: AlertController ) {
    this.alertCtrl = alertCtrl;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
  }

  showUpload() {
    document.getElementById("stored").style.display = "none";
   document.getElementById("add").style.display = "block";
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
     console.log(err);
    });
  }

  upload() {
    
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    var sname = prompt("Please give name for file");
    this.presentLoadingText();
    imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
     // Do something here when the data is succesfully uploaded!
     this.uploadDb(snapshot,sname);
     
        this.showSuccesfulUploadAlert();
    });

  }

  uploadDb(savedPicture,name){
    var ref = firebase.database().ref('assets');
    

    return new Promise((resolve,reject)=> {
      var dataTosave = {
        'URL' : savedPicture.downloadURL,
        'name' : name
        

      };

      ref.push(dataTosave);

    });
}

loadData() {
  document.getElementById("loaded").style.display="block";
  firebase.database().ref('assets').on('value',(_data)=>{
    var result = [];

    _data.forEach( (_childdData) => {
      
      var element = _childdData.val();
      element.id = _childdData.key;

      result.push(element);
      
      return false;
    } );
    

    this.assetCollection = result;
  });
  console.log(this.assetCollection);

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

  showPrompt():any {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            return data;
          }
        }
      ]
    });
    prompt.present();
  }

}
