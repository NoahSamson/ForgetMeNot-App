/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, RadioButton } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {storage} from 'firebase';
import firebase from 'firebase';
import {OnInit} from '@angular/core';
import {Title } from '@angular/platform-browser';
import{UserPage}from '../user/user';
import {AuthServiceProvider } from '../../providers/auth-service/auth-service';
import moment from 'moment';
import {File} from '@ionic-native/file';

//to resolve the file of the local system
declare var window:any;

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
  currentFolder:any
  imageId:any;
  userId:any;
  type:any;
  blob:any;

  constructor(private camera:Camera,public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, alertCtrl: AlertController, public authService: AuthServiceProvider ) {
      this.alertCtrl = alertCtrl; 
    // gets the current user logged in
    this.userId=authService.getCurrentUser();
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
    // to load the images on the gallery div once the page is opened
    this.loadData();
    //set the current path to the gallery folder where the database is accessing the current data from
    this.currentFolder="Gallery/";
  }

/**
 * To browse the local storage of the phone to get the file to be uploaded
 */
 async browsePhone(){
    this.camera.getPicture({
      //camera options
     sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
     mediaType:this.camera.MediaType.ALLMEDIA,
     destinationType: this.camera.DestinationType.FILE_URI,
     quality: 50,
   }).then(fileuri => {
   
    //get the file extension to check if it is an image or video
    var fileName = fileuri.substr(fileuri.lastIndexOf('/') + 1);
    var fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
    //if it is a video
    if (fileExtension=='mp4'){
    this.type='video/mp4'
     //add the video path to the imageSrc so that it will be displayed on the page
    this.imageSrc =  'data:video/mp4;base64,' + fileuri;
    }
    //if it is an image
    else if((fileExtension=='jpg')||(fileExtension=='png')||(fileExtension=='jpeg')){
    this.type='image/png'
    //encodes image to base64
    window.plugins.Base64.encodeFile(fileuri, function(base64){  // Encode URI to Base64 needed for contacts plugin
      fileuri = base64;
    });
    //add the image path to the imageSrc so that it will be displayed on the page
    this.imageSrc = fileuri;
   
    }
    //resolve the local file system
     window.resolveLocalFileSystemURL("file://"+fileuri,FE=>{
         FE.file(file=>{
           const FR = new FileReader();
           FR.onloadend=(res:any)=>{
             //creates a blob obj
               let AF =res.target.result
                this.blob=new Blob([new Uint8Array(AF)],{type:this.type})                    
           };
           FR.readAsArrayBuffer(file);
         })
     })
   })
  }

/**
 * To upload the selected file to the storage
 */
  upload() {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child('UserStorage/'+filename);

    //prompt to get the name of the file
    var sname = prompt("Please give name for file"); 
  
    this.presentLoadingDefault();
    //Puts the blob to the storage
    imageRef.put(this.blob).then((snapshot: any)=> {

    //When it is successfully uploaded. get the download url of the image
     this.url=snapshot.downloadURL;
     this.presentLoadingDefault();
     //uploads the element to the database
     this.uploadDb(this.url,sname,"users/"+this.userId+"/Assets/Gallery/");
     
     this.showSuccesfulUploadAlert("Successfully Uploaded","");
    });   
  }

  uploadDb(savedPicture,name,folderName){
    
    //get the reference to save the element
    var ref = firebase.database().ref(folderName);
    return new Promise((resolve,reject)=> {
     //specify the elment's attributes to be pushed to the databse
      var dataTosave = {
        'URL' : savedPicture,
        'name' : name,
        'date': moment(new Date().toISOString()).format('DD/MM/YYYY H:mm') ,
        'type' : this.type  
      };
      //add the element to the specified folder in database
      ref.push(dataTosave);
      //after adding clear the value in the imageSrc
      this.imageSrc=""

   });  
}

//If the user wants to cancel the selected file
cancelUpload(){
  this.imageSrc="";
}

// to retrieve the files from the firebase in the gallery folder
loadData() {
  //reference to the database 
  firebase.database().ref('users/'+this.userId+'/Assets/Gallery').on('value',(_data)=>{
    var result = [];
      // for each child node
    _data.forEach( (_childdData) => {
      //get the values and the id of them
      var element = _childdData.val();
      element.id = _childdData.key;
      // add the element to a local results array
      result.push(element); 
      return false;
    } );
    
    // add the result array to the global array
    this.assetCollection = result;
  });
  console.log(this.assetCollection);

}

// alert to show a successful note after the file is uploaded
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
  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Uploading image'
    });
    this.loading.dismiss(); 
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
  firebase.database().ref('users/'+this.userId+'/Assets/Albums').on('value',(_data)=>{
    var result = [];
    _data.forEach( (_childdData) => {
    //get the items
      var element = _childdData.val();
      element.id = _childdData.key;
      //push it to the local array result
      result.push(element);
      
      return false;
    } );
    this.albumFolders=result;  
  });
 }

 //Load the pics in a specific album folder to albumPics global variable
 loadAlbumFolder(albumName){
  firebase.database().ref('users/'+this.userId+'/Assets/Albums/'+albumName).on('value',(_data)=>{
    var result = [];
    _data.forEach( (_childdData) => {
      
      var element = _childdData.val();
      element.id = _childdData.key;
     // push the element to the array
      result.push(element);
      
      return false;
    });
    // add the local result array to the class array albumPics
    this.albumPics=result;  
  });
 }

 //when the pic is selected to add to a folder this method is invoked
 albumOption(imageURL,imageName,typeOfFile){
   //gets the type of the current file viewed
   this.type=typeOfFile
   //clears the object stored in the fullimage varaible
    this.fullImage="";
    //gets the selected image's url and name
    this.url=imageURL;
    this.name=imageName;
    //div to display the names is set to block
    document.getElementById("selectFolder").style.display="block";
    //load the album names from the firebase
    this.loadAlbums();
 }

 //when the user selects an album to add a selected pic
   selectedAlbum(albumName){
     
     //clears the viewed image
      this.fullImage="";
      //loads the album names and displays it on selectfolder div
      this.loadAlbums();
      document.getElementById("selectFolder").style.display="block";

      //hides the gallery div 
      document.getElementById("loaded").style.display = "none";

      //changes the current folder tonthe selected album path in firebase
      this.currentFolder="Albums/"+albumName+"/";

      if(albumName!=null){
        this.currentFolder=albumName;
        //sets the current folder path to the album path of the firebase
        var albumPath='users/'+this.userId+'/Assets/Albums/'+albumName;
        this.uploadDb(this.url,this.name,albumPath);
        this.openFolder(albumName);
      }
   }

   //when the user selects a pic to add to the lifestory
   selectedLifestory(imageURL,imageName){
     //since only images can be added to lifestory by default the type is set to image/png
    this.type="image/png"
    //store the url and the name f the current file which is displayed on ion-card
    this.url=imageURL;
    this.name=imageName;
    //upload the image to the lifestory folder
    this.uploadDb(this.url,this.name,"users/"+this.userId+"/Assets/Life-story");
    this.showSuccesfulUploadAlert("Added","to Life-story")
   }

  //to diplay the album folders in a div 
   openAlbum(){ 
    document.getElementById("btnBrowse").style.display="none" 
    this.loadAlbums();
    document.getElementById("title").innerHTML="Albums"  
    document.getElementById("selectFolder").style.display="none";
    document.getElementById("grid1").style.display = "none";
    document.getElementById("albums").style.display = "block";
    document.getElementById("grid3").style.display = "none";
    document.getElementById("grid2").style.display = "block";    
   }

   //to pop the selected image on a card to display it in fullview
   viewImage(imageId){
     this.imageId=imageId;
      firebase.database().ref('users/'+this.userId+'/Assets/'+this.currentFolder+imageId+"/").on('value', (snapshot) => {
        this.fullImage = snapshot.val();
       // hides the other  to div to display only the ion-card 
        document.getElementById("grid1").style.display = "none";
        document.getElementById("grid2").style.display = "none";
        document.getElementById("grid3").style.display = "none";
      });  
   }

//when the user taps on an album to view the pics in it
  openFolder(albumName){
    document.getElementById("btnBrowse").style.display="none"
    //changes the albumname to the currently tapped folder
    this.albumName=albumName;
    document.getElementById("title").innerHTML=albumName;
    //loads the pics in that particular folder
    this.loadAlbumFolder(albumName);

    //changes the folder path
    this.currentFolder="Albums/"+albumName+"/";
    console.log(this.currentFolder);

    // hides and shows the div so that only the grid and some buttons which has to be displayed on the 
    // to view the pics in a selected folder

    document.getElementById("selectFolder").style.display="none";
    document.getElementById("grid1").style.display = "none";
    document.getElementById("albums").style.display = "none";
    document.getElementById("grid2").style.display = "none";
    document.getElementById("grid3").style.display = "block";
    document.getElementById("albumView").style.display = "block";
  }

  //to close the view of the full image
   closeModal(){
     
      /**
       * checks for the folder from where the image was viewed on the ion-card
       * and fter the view is closed reloads the folder to display all the oter items on that folder
       */
      if(this.currentFolder=="Gallery/"){
      document.getElementById("grid1").style.display = "block";
      }else{
        document.getElementById("grid3").style.display = "block";
      }
      //clears the fullImage 
      this.fullImage="";
   }

   //to go to gallery view
   goToGallery(){
    document.getElementById("btnBrowse").style.display="block"
      this.currentFolder="Gallery/";
      document.getElementById("title").innerHTML="Gallery"
      document.getElementById("grid1").style.display = "block";
      document.getElementById("albumView").style.display = "none";
      document.getElementById("grid2").style.display = "none";
      document.getElementById("albums").style.display = "none";
      document.getElementById("grid3").style.display = "none"; 
   }

   //to create a new folder to add the selected pic
   createFolder(){

    //new name and the current folder is set to the new folder
      this.currentFolder="Albums"+albumName+"/";
      var albumName=prompt("AlbumName")
      if(albumName!=null){
      this.albumName=albumName;
      var albumPath="users/"+this.userId+"/Assets/Albums/"+albumName;
      this.uploadDb(this.url,this.name,albumPath);
      this.openFolder(albumName);
      }
   }

   

Delete(){
  //creates an alert and ensures whether to delete
 let alert = this.alertCtrl.create({
   title: 'Remove',
   subTitle: '',
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
   //if user click yes
   if(data==true){
    
     // if the response is true removes the image from the lifestory
    firebase.database().ref('users/'+this.userId+'/Assets/'+this.currentFolder+ this.imageId).remove();
     //clears the image which is full viewed
    this.fullImage="";
    //call to refresh the page
    this.presentLoadingDefault();
  
   }
});
 
}
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    this.loadData();
    loading.present();
    setTimeout(() => {
      //checks for the current folder if it is gallery
      //loads the data in the gallery and sets the grid 1 to visible to display the loaded pics
      if (this.currentFolder=="Gallery/"){
      this.loadData();
      document.getElementById("grid1").style.display = "block";
      }
      //else loads the pics in the album and views it in grid 3
      else{ 
        this.loadAlbumFolder(this.albumName);
      document.getElementById("grid3").style.display = "block"; 
    
      }
      //clears the dismiss after 5secs
      loading.dismiss();
    }, 5000);
  }
  //to rename the image name
  Rename(){
    var fileName=prompt("Rename your File");
    //data to be pushed
    var updatedName={
      name:fileName
    }
   var imageRef= firebase.database().ref('users/'+this.userId+'/Assets/'+this.currentFolder).child(this.imageId);
   imageRef.once('value', function(snapshot){
     //if the particular child doesnt exist
      if(snapshot.val()===null){
          this.showSuccesfulUploadAlert('Something went wrong','');
      }
      //if it exists update the data
      else{
        imageRef.update(updatedName);
        
        
      }
   })
  }
}
 