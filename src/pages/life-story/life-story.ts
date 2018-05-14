import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, LoadingController,Loading } from 'ionic-angular';
import firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Slides } from 'ionic-angular';

/**
 * Generated class for the LifeStoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-life-story',
  templateUrl: 'life-story.html',
  
  
})



export class LifeStoryPage {
  loading:Loading;
  lifeStoryPics:any;
  alertCtrl: AlertController;
  userId:any;
  @ViewChild(Slides) slides: Slides;
 
  constructor( public loadingCtrl: LoadingController,public authService: AuthServiceProvider,public navCtrl: NavController, public navParams: NavParams,alertCtrl: AlertController ) {
    this.alertCtrl = alertCtrl;
    this.userId=authService.getCurrentUser();
  }
  // on view of the page
  ionViewDidLoad() {
    //loads the elements from the lifestory
    this.loadData();
  
  }
  ionViewWillLeave(){
    if (this.slides !== undefined) {
      this.slides.stopAutoplay();
    }
  }
  ionViewDidEnter(){
    //alert("hello")
    if (this.slides !== undefined) {
      this.slides.startAutoplay();
    }
  }
  
 
  async loadData() {
    //reference to the database 
    firebase.database().ref('users/'+this.userId+'/Assets/Life-story/').on('value',(_data)=>{
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
      this.lifeStoryPics = result;
    });
    console.log(this.lifeStoryPics);
  
  }

  // this method is invoked when an image on the slideshow is longpressed
  Remove(deleteKey){
    let alert = this.alertCtrl.create({
      title: 'Remove',
      subTitle: 'from Life-story',
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
        firebase.database().ref('users/'+this.userId+'/Assets/Life-story/'+ deleteKey).remove();
          // this.loadData();
          this.presentLoadingDefault();
      
        
      }
});
    
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...'
    });
    //this.loadData();
    loading.present();
    setTimeout(() => {
     this.loadData();
      loading.dismiss();
    }, 5000);
  }
}
