import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, LoadingController, Loading } from 'ionic-angular';
import { Members } from '../../models/members.model';
import firebase from 'firebase';
import{UserPage}from '../user/user';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {EachMemberPage} from '../each-member/each-member';
/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {

  member= {} as Members;
  userId:any;
  alertCtrl:AlertController;
  imageSrc:any;
  memberList:any;
  memberForm: FormGroup;

  constructor(private loading:Loading, public loadingCtrl: LoadingController,public formBuilder: FormBuilder, private camera:Camera,public navCtrl: NavController, public navParams: NavParams, alertCtrl: AlertController, public authService: AuthServiceProvider) {
    this.userId=authService.getCurrentUser();
    this.alertCtrl = alertCtrl;
    this.memberForm = formBuilder.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      relationship: ['', Validators.required],
      email: [''],
      address: [''],
      contNo: [''],
      DOB: [''],
     
    });
    this.loadMembers();
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
    
  }

  viewMemberForm(){
    this.initializeMember();
    document.getElementById("allMembs").style.display="none";
    document.getElementById("MemberDetails").style.display="block";
    document.getElementById("add").style.display="none";
  }

  cancel(){
    this.imageSrc="";
    this.memberForm.reset();
    this.viewAllMembers();
  }
  initializeMember(){
    this.member.firstName="";
    this.member.lastName="";
    this.member.address="";
    this.member.DOB=null;
    this.member.email="";
    this.member.relationship="";
    this.member.faceID="";
    this.member.profPic="";
    this.member.phoneNum="";

  }
   addMember(member:Members){
    this.loading.present();
     this.uploadProfPic();
    var ref = firebase.database().ref("users/"+this.userId+"/Members/");
    return new Promise((resolve,reject)=> {
      var dataTosave = {
        'firstName': this.member.firstName,
        'lastName':this.member.lastName,
        'DOB':this.member.DOB,
        'email' : this.member.email,
        'phoneNo':this.member.phoneNum,
        'relationship':this.member.relationship,   
        'profPic':this.member.profPic
      };
      //add the element to the specified folder
      ref.push(dataTosave);
      this.loading.dismiss();
      this.showSuccesfulUploadAlert();
      this.imageSrc="";
      this.memberForm.reset();
      this.viewAllMembers();
   });  
  }

  viewAllMembers(){
    document.getElementById('icon').style.display="block"
    document.getElementById('picButtons').style.display="block"
    document.getElementById("allMembs").style.display="block";
    document.getElementById("MemberDetails").style.display="none";
    document.getElementById("add").style.display="block";
  }

  loadMembers(){
     //reference to the database 
  firebase.database().ref("users/"+this.userId+"/Members").on('value',(_data)=>{
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
    this.memberList = result;
  });
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

  uploadProfPic(){
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`MembersProfilePic/${filename}.jpg`);
    imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
      // Do something here when the data is succesfully uploaded!
       this.member.profPic= snapshot.downloadURL;
      }); 
  }

  cancelUpload(){
    document.getElementById('icon').style.display="block"
    document.getElementById('picButtons').style.display="block"
    this.imageSrc="";
  }
  showSuccesfulUploadAlert() {
    
    let alert = this.alertCtrl.create({
      title:"Added Member" ,
      subTitle: "to your profile",
      buttons: ['OK']
    });
    alert.present();
  }


  presentLoadingDefault() {
    this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    this.uploadProfPic();
    setTimeout(() => {
     
      //clears the dismiss after 5secs
  
    }, 5000);
  }

  viewProfile(id){

    alert('invoked')
   // this.navCtrl.push(EachMemberPage);
  

  }
 
}
