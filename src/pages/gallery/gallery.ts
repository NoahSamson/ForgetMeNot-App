import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, RadioButton } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {storage} from 'firebase';
import firebase from 'firebase';
import {OnInit} from '@angular/core';
import {Title } from '@angular/platform-browser';
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
  //Class variables
  myPhotosRef: any;
  imageSrc: string;
  loading:Loading;
  alertCtrl: AlertController;
  url:any;
  name:any;
  assetCollection:any;
  albumFolders:any;
  theImage:any;
  albumPics:any;
  albumName:any;
  fullImage:any;
  currentFolder:any;

  constructor(private camera:Camera,public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, alertCtrl: AlertController ) {
    this.alertCtrl = alertCtrl; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
    // to load the images on the gallery div once the page is opened
    this.loadData();
    //set the current path to the where where the database is accessing
    this.currentFolder="Gallery/";
  }

// to open the camera and capture the image
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

    //prompt to get the name of the file
    var sname = prompt("Please give name for file"); 
    this.presentLoadingText();

    imageRef.putString(this.imageSrc, firebase.storage.StringFormat.DATA_URL).then((snapshot: any)=> {
    // Do something here when the data is succesfully uploaded!
     this.url=snapshot.downloadURL;
     this.uploadDb(this.url,sname,"Assets/Gallery/");
      this.showSuccesfulUploadAlert("Uploaded!","Picture is uploaded");
     this.loadData();
    });   
  }

  uploadDb(savedPicture,name,folderName){
    //get the reference to save the image url
    var ref = firebase.database().ref(folderName);
    return new Promise((resolve,reject)=> {
      var dataTosave = {
        'URL' : savedPicture,
        'name' : name      
      };
      //add the element to the specified folder
      ref.push(dataTosave);
   });  
}

// to retrieve the image from the firebase
loadData() {
  //reference to the database 
  firebase.database().ref('Assets/Gallery').on('value',(_data)=>{
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
    this.assetCollection = result;
  });
  console.log(this.assetCollection);

}

// alert to show a successful note after the picture is uploaded
  showSuccesfulUploadAlert(Title,subTitle) {
    this.loading.dismiss();
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
  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Uploading image'
    });
    this.loading.present(); 
  }

  //To get some information from the user
  showPrompt(text):any {
    let prompt = this.alertCtrl.create({
      title: 'Enter a name for the '+text,
      message: "",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Okay',
          handler: data => {
            console.log(data);
            return data;
          }
        }
      ]
    });
    prompt.present();
  }

  //loads the album folders from firebase to albumFolders global variable
 loadAlbums(){
  firebase.database().ref('Assets/Albums').on('value',(_data)=>{
    var result = [];
    _data.forEach( (_childdData) => {
      
      var element = _childdData.val();
      element.id = _childdData.key;
      console.log(element.id);
      result.push(element);
      
      return false;
    } );
    this.albumFolders=result;  
  });
 }

 //Load the pics in a specific album folder to albumPics global variable
 loadAlbumFolder(albumName){
  firebase.database().ref('Assets/Albums/'+albumName).on('value',(_data)=>{
    var result = [];
    _data.forEach( (_childdData) => {
      
      var element = _childdData.val();
      element.id = _childdData.key;
      console.log(element.id);
      result.push(element);
      
      return false;
    } );
    this.albumPics=result;  
  });
 }

 //when the pic is selected to add to a folder this method is invoked
 albumOption(imageURL,imageName){
   //clears the object stored in the fullimage varaible
    this.fullImage="";
    //gets the selected image's url and name
    this.url=imageURL;
    this.name=imageName;
    document.getElementById("selectFolder").style.display="block";
    this.loadAlbums();
 }

 //when the user selects an album to add a selected pic
   selectedAlbum(albumName){
      this.fullImage="";
      this.loadAlbums();
      document.getElementById("selectFolder").style.display="block";
      document.getElementById("loaded").style.display = "none";
      this.currentFolder="Albums/"+albumName+"/";
      if(albumName!=null){
        this.currentFolder=albumName;
        //sets the current folder path to the album path of the firebase
        var albumPath='Assets/Albums/'+albumName;
        this.uploadDb(this.url,this.name,albumPath);
        this.openFolder(albumName);
      }
   }

   //when the user selects a pic to add to the lifestory
   selectedLifestory(imageURL,imageName){
    this.url=imageURL;
    this.name=imageName;
    this.uploadDb(this.url,this.name,"Assets/Life-story");
    document.getElementById("grid1").style.display = "block";
    this.showSuccesfulUploadAlert("Added","to Life-story")
   }

  //to diplay the album folders available 
   openAlbum(){  
    this.loadAlbums();
    document.getElementById("title").innerHTML="Albums"  
    document.getElementById("selectFolder").style.display="none";
    document.getElementById("grid1").style.display = "none";
    document.getElementById("btnGallery").style.display = "block";
    document.getElementById("albums").style.display = "block";
    document.getElementById("btnCapture").style.display = "none";
    document.getElementById("grid3").style.display = "none";
    document.getElementById("grid2").style.display = "block";    
   }

   //to pop the selected image on a card to display it in fullview
   viewImage(imageId){
      firebase.database().ref('Assets/'+this.currentFolder+imageId+"/").on('value', (snapshot) => {
        this.fullImage = snapshot.val();
        console.log(this.fullImage.name);
        document.getElementById("btnCapture").style.display = "none";
        document.getElementById("btnAlbum").style.display = "none";
        document.getElementById("grid1").style.display = "none";
        document.getElementById("grid2").style.display = "none";
        document.getElementById("grid3").style.display = "none";
        document.getElementById("btnGallery").style.display = "none"; 
      });  
   }

//when the user taps on an album to view the pics in it
  openFolder(albumName){
    document.getElementById("title").innerHTML=albumName;
    this.loadAlbumFolder(albumName);
    this.currentFolder="Albums/"+albumName+"/";
    console.log(this.currentFolder);
    document.getElementById("selectFolder").style.display="none";
    document.getElementById("grid1").style.display = "none";
    document.getElementById("btnGallery").style.display = "block";
    document.getElementById("albums").style.display = "none";
    document.getElementById("btnAlbum").style.display = "block";
    document.getElementById("grid2").style.display = "none";
    document.getElementById("grid3").style.display = "block";
    document.getElementById("btnCapture").style.display = "none";
    document.getElementById("albumView").style.display = "block";
  }

  //to close the view of the full image
   closeModal(){
      document.getElementById("btnGallery").style.display = "block";
      document.getElementById("btnCapture").style.display = "block";
      document.getElementById("btnAlbum").style.display = "block";
      console.log(this.currentFolder);
      if(this.currentFolder=="Gallery/"){
      document.getElementById("grid1").style.display = "block";
      }else{
        document.getElementById("grid3").style.display = "block";
      }
      this.fullImage="";
   }

   //to go to gallery view
   goToGallery(){
      this.currentFolder="Gallery/";
      document.getElementById("btnGallery").style.display = "block";
      document.getElementById("btnCapture").style.display = "block";
      document.getElementById("btnAlbum").style.display = "block";
      document.getElementById("title").innerHTML="Gallery"
      document.getElementById("grid1").style.display = "block";
      document.getElementById("albumView").style.display = "none";
      document.getElementById("grid2").style.display = "none";
      document.getElementById("albums").style.display = "none";
      document.getElementById("grid3").style.display = "none"; 
   }

   //to create a new folder to add the selected pic
   createFolder(){
      this.currentFolder="Albums"+albumName+"/";
      var albumName=prompt("AlbumName")
      if(albumName!=null){
      var albumPath="Assets/Albums/"+albumName+"/";
      this.uploadDb(this.url,this.name,albumPath);
      this.openFolder(albumName);
      }
   }
}
 