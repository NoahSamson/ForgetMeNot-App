import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import{MembersPage} from '../members/members'
import { Members } from '../../models/members.model';


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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EachMemberPage');
  }



 
}
