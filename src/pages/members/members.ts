
/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController, Loading } from 'ionic-angular';
import { Members } from '../../models/members.model';
import firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {EachMemberPage} from '../each-member/each-member';


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
  loading:Loading;

  constructor( public loadingCtrl: LoadingController,public formBuilder: FormBuilder, private camera:Camera,public navCtrl: NavController, public navParams: NavParams, alertCtrl: AlertController, public authService: AuthServiceProvider) {
    this.userId=authService.getCurrentUser();
    this.alertCtrl = alertCtrl;

    // To validate the member form
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

  // to view the div where the member form is present 
  viewMemberForm(){
    this.initializeMember();
    document.getElementById("allMembs").style.display="none";
    document.getElementById("MemberDetails").style.display="block";
    document.getElementById("add").style.display="none";
  }
//to hide the member form which is to cancel adding the member
  cancel(){
    this.imageSrc="";
    this.memberForm.reset();
    this.viewAllMembers();
  }
  /**
   * This will initialize the attributes to null which
   * will prevent the null pointer exception when the user doesnt fill the certain attributes on the form
   */
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

  /**
   * This is to push the member to the database 
   */
   async addMember(member:Members){
    this.presentLoadingDefault();
    //only if the user uploads a pic it will be stored to the storage else 
    //there is no need to call the uploadProfPic()
    if(this.imageSrc){
    await this.uploadProfPic();
    }
    var ref = firebase.database().ref("users/"+this.userId+"/Members/");
    return new Promise((resolve,reject)=> {
      //attributes of the member model
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

      //once uploaded reset the form and imagesrc
      this.imageSrc="";
      //after the data is pushed clears the member form
      this.memberForm.reset();
      this.viewAllMembers();
   });  
  }

  //This method is to display the member list and not the member form
  viewAllMembers(){
    document.getElementById('icon').style.display="block"
    document.getElementById('picButtons').style.display="block"
    document.getElementById("allMembs").style.display="block";
    document.getElementById("MemberDetails").style.display="none";
    document.getElementById("add").style.display="block";
  }

  //To load the members from the database 
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

  /**
   * If the user wants to upload a prof pic of the member by capturing
   */
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
     //once captured hides the button to capture 0r upload pic and the icon of profile pic
      document.getElementById('icon').style.display="none"
      document.getElementById('picButtons').style.display="none"

      //puts the base 64 image data to the imageSrc variable so that the image is displayed
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     console.log(err);
    });
  }
  
/**
 * If the user wants to access the local storage to upload a pic of the member
 */
  browsePhone(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      //once captured hides the button to capture 0r upload pic and the icon of profile pic
      document.getElementById('icon').style.display="none"
      document.getElementById('picButtons').style.display="none"

       //puts the base 64 image data to the imageSrc variable so that the image is displayed
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
 
  }

  //this is to upload the pic to the firebase storage 
 async uploadProfPic(){
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = await storageRef.child(`Member_Photos/${filename}.jpg`);
    await imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
      // gets the download url of the image from the storage
       this.member.profPic= snapshot.downloadURL;
      }); 
  }

  // cancel the current image if the user doesnt want upload it
  cancelUpload(){
    document.getElementById('icon').style.display="block"
    document.getElementById('picButtons').style.display="block"
    this.imageSrc="";
  }

  // a alert popup
  showSuccesfulUploadAlert() {  
    let alert = this.alertCtrl.create({
      title:"Added Member" ,
      subTitle: "to your profile",
      buttons: ['OK']
    });
    alert.present();
  }

//To present the loading graphics
  presentLoadingDefault() {
   this.loading= this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    this.loading.present();
    setTimeout(() => { 
      this.loadMembers();
      this.loading.dismiss();
    }, 5000);
  }

  /**when the row of each member is clicked this method
   * is invoked and it pushes to the each member page passing the selected memb id
   */
  viewProfile(id){
    this.navCtrl.push(EachMemberPage, {
      memberID:id
    });
  }
 
  //to remove the member on long press
  Remove(deleteKey){
    let alert = this.alertCtrl.create({
      title: 'Remove',
      subTitle: 'from Member List',
      buttons: [
        {
            text: 'Okay',
            handler: () => {
                alert.dismiss(true);
                return false;
            }
        }, {
            text: 'Cancel',
            handler: () => {
                alert.dismiss(false);
                return false;
            }
        }
    ]
    });
    alert.present();
    alert.onDidDismiss((data) => {
      console.log('Yes/No', data);
      if(data==true){
        console.log(deleteKey)
        // if the response is true removes the image from the lifestory
        firebase.database().ref('users/'+this.userId+'/Members/'+ deleteKey).remove();
          // this.loadData();
          this.presentLoadingDefault();       
      }
        });
    
    }
}
