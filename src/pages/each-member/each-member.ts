import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading} from 'ionic-angular';
import{MembersPage} from '../members/members'
import { Members } from '../../models/members.model';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the EachMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-each-member',
  templateUrl: 'each-member.html',
})
export class EachMemberPage {
member={} as Members;
userId:any;
memberID: any;
imageSrc:any;
url:any;
loading:Loading;
alertCtrl: AlertController;
memberPhotos:any;

  constructor(private camera:Camera,public navCtrl: NavController, public navParams: NavParams,public authService: AuthServiceProvider,  public loadingCtrl: LoadingController, alertCtrl: AlertController,) {
    //gets the current user
    this.userId=authService.getCurrentUser(); 
    // accepts the parameters which is the member id
    this.memberID = navParams.get('memberID');
    this.alertCtrl = alertCtrl; 
    // to display the images added to the member profile
    this.loadData();
  }

  ionViewDidLoad() {
  /**
   * when the page loads from the accepted parameter 
   * get the meber which is added to the firebase and load it back to the app
   */
    const personRef: firebase.database.Reference = firebase.database().ref('/users/' + this.userId+'/Members/'+this.memberID);
    personRef.on('value', personSnapshot => {
      this.member= personSnapshot.val();
    });
    document.getElementById('title').innerHTML=this.member.firstName;
    console.log('ionViewDidLoad EachMemberPage');
  }

  /**
 * Browsing the local storage to upload pics
 */
  browsePhone(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      //makes the imagedata as base64
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

//upload the image to the storage
  upload() {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`Member_Photos/${filename}.jpg`);

    //prompt to get the name of the file
    var sname = prompt("Please give name for file"); 
    this.presentLoadingDefault();
    imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
    // gets the url of the image added to the firebase
     this.url=snapshot.downloadURL;

    this.uploadDb(sname);
    this.showSuccesfulUploadAlert("Uploaded!","Picture is uploaded");
    this.loadData();
     
    });   
  }
  
  // to display the loading graphics
  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Uploading image'
    });
    this.loading.dismiss(); 
  }

// to upload the image and the name to the firebase database
  uploadDb(name){
    //get the reference to save the image url
    var ref = firebase.database().ref('users/'+this.userId+'/Members/'+this.memberID+'/MemberPhotos');
    return new Promise((resolve,reject)=> {
      //attributes to be saved to the database
      var dataTosave = {
        'URL' : this.url,
        'name' : name,  
      };
      //add the element to the specified folder
      ref.push(dataTosave);
   });  
   
}

//clears the imageSrc if the user wants to cancel the image before uploading it to storage
cancelUpload(){
  this.imageSrc="";
}

 
// to retrieve the image from the firebase
loadData() {
  //reference to the database 
  firebase.database().ref('users/'+this.userId+'/Members/'+this.memberID+'/MemberPhotos').on('value',(_data)=>{
    var result = [];
      // for each child node
    _data.forEach( (_childdData) => {
      //get the values and the id of them
      var element = _childdData.val();
      element.id = _childdData.key;
      // add the element to a local results arrat
      result.push(element); 
      return false;
    } );
    
    // add the result array to the global array
    this.memberPhotos = result;
  });
  console.log(this.memberPhotos);

}

// alert to show a successful note after the picture is uploaded
  showSuccesfulUploadAlert(Title,subTitle) {
    
    let alert = this.alertCtrl.create({
      title:Title ,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
    // clear the previous photo data in the variable
    this.imageSrc = "";   
  }

  // to display the loading graphics
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });

    loading.present();
    setTimeout(() => { 
      loading.dismiss();
    }, 5000);
  }
}
