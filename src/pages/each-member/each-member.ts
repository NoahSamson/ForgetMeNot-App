import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import{MembersPage} from '../members/members'

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

  constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe('hello',(memberId)=>{
     this.viewMember();
     // this.viewMember(memberId);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EachMemberPage');
  }
viewMember(){
  alert('hi');
}
 
}
