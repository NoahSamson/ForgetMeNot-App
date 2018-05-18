import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import {Geolocation } from '@ionic-native/geolocation';
import { GeolocationMarker } from 'geolocation-marker';
import { SMS } from '@ionic-native/sms';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from 'firebase/app';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  //class variables
  map: any;
  circle:any;
  geolocation:Geolocation;
  latitude:number;
  longitude:number;
  marker:any;
  userid: any;
  sendMsg: boolean;
  public user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams,public sms:SMS, public toastCtrl:ToastController, public authService: AuthServiceProvider) {
    //get the current user
    this.userid = authService.getCurrentUser();    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
    //boolean variable to check if the escape message has been sent or not
    this.sendMsg = false;
  }

  addRadius(){
    //setting radius and adding circle to the map
    var myradius = parseInt(prompt("Enter radius in meters"));

    if(myradius!=null){
            if(this.circle!= null){
              this.circle.setMap(null);
              this.circle = null;
              console.log(this.circle);
            }
     //adding a radius
      navigator.geolocation.getCurrentPosition(
      (position) => {  
          this.circle = new google.maps.Circle({
          map: this.map,
          center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
          visible:true,
          radius:myradius,
          color:"RED",
          strokeColor:"RED"     
          });
        });
        //checks if the patient is in or out of the radius
   this.checkRadius();

   //access the database to update the user's location and radius
    firebase.database().ref('users/'+this.userid).update({
      "radius": myradius,
      "cenLocLat":this.latitude,
      "cenLocLong":this.longitude
    });
    } 
    }

   loadMap(){
    //getting the current position 
    let locationOptions = {timeout: 2000, enableHighAccuracy: true};

    navigator.geolocation.getCurrentPosition(
 
        (position) => {
 
            let options = {
              center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP,     
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, options);
            this.latitude=position.coords.latitude;
            this.longitude=position.coords.longitude;

      //adding a marker to the current position 
     
      this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.latitude, this.longitude)
      });           
        },
        (error) => {
            console.log(error);
        }, locationOptions
    );
  }

  //to give the description of the location
  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
   
  }

   //to check if the user is in or out of the radius
   checkRadius() {
   let watch =  navigator.geolocation.watchPosition((posi)=>{
      //gets the current center
      let from =this.circle.getCenter();
      //gets the set radius center
      let to = new google.maps.LatLng(posi.coords.latitude,posi.coords.longitude);
      this.marker.setPosition(to);
      //calc to check if user has crossed the radius border
      if(google.maps.geometry.spherical.computeDistanceBetween(from, to) <= this.circle.radius){
        //if he is inside set the boolean variable to false(prevents from sending message)
        this.sendMsg=false;
        }else{
          //if he is outside
          if (!this.sendMsg){ // to check if already a message has been sent 
           //if it is not sent send the message to the caretaker
            this.send();
            //set the boolean variable to false(prevents from sending message again and again)
            this.sendMsg = true;
        }
      }
      this.authService.userAuthState.onAuthStateChanged(user => {
        //checks if user is logged in
        if(!user){
          navigator.geolocation.clearWatch(watch);
       } })
    })

  }

  //the below method will send an sms to the caretaker if the patient moves out of the specified distance from his/her home
  send(){
    //gets the caretaker num from the database
    var num;
    firebase.database().ref('users/'+this.userid+'/caretakerNum').on('value',(snapshot) =>{
      num = snapshot.val();
   })
  
    this.sms.send(num, "Patient trying to escape")
      .then(()=>{
        let toast = this.toastCtrl.create({
          message: 'Message send successfully',
          duration: 3000        });
        toast.present();
      },()=>{
        let toast = this.toastCtrl.create({
          message: 'Sending message is a failure',
          duration: 3000        });
        toast.present();
      });
  }
}
