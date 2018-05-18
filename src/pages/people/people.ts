import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
//import {EachMemberPage} from '../each-member/each-member';


/**
 * Generated class for the PeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
})
export class PeoplePage {

  userId:any;
  imageSrc:any;
  metList:any;
  memberList: any;
  savedList: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public authService: AuthServiceProvider) {
    this.userId=authService.getCurrentUser();
    this.loadMembers();
    this.loadSavedMembers();
    this.compare();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeoplePage');
    
  }

  

  loadPeopleMet(){
    //reference to the database 
 firebase.database().ref("users/"+this.userId+"/PeopleMet").on('value',(itemSnapshot)=>{
    itemSnapshot.forEach( itemSnap => {
      this.metList.push(itemSnap.val());
      return false;
    });
   } );
   console.log(this.metList[0]);
 }

 loadMembers(){
  //reference to the database 
firebase.database().ref("users/"+this.userId+"/PeopleMet").on('value',(_data)=>{
 var result = [];
   // for each child node
 _data.forEach( (_childdData) => {
   //get the values and the id of them
   var element = _childdData.val();
   console.log(element);
   element.id = _childdData.key;
   // add the element to a local results arrat
   result.push(element); 
   return false;
 } );
 
 // add the result array to the global array
 this.memberList = result;
 console.log(this.memberList);
});
}

loadSavedMembers(){
  //reference to the database 
firebase.database().ref("users/"+this.userId+"/Members").on('value',(_data)=>{
 var result = [];
   // for each child node
 _data.forEach( (_childdData) => {
   //get the values and the id of them
   var element = _childdData.val();
   console.log(element);
   element.id = _childdData.key;
   // add the element to a local results arrat
   result.push(element); 
   return false;
 } );
 
 // add the result array to the global array
 this.savedList = result;
 console.log(this.memberList);
});
}

compare(){
  this.memberList.forEach(element => {
    this.savedList.forEach(saved => {
      if(element.name == saved.firstName){
        element.relationship = saved.relationship;
        element.profPic = saved.profPic;
      }
    });
    
  });
}

}
