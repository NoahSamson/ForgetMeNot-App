import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {storage} from 'firebase';
import firebase from 'firebase';
import {Geolocation } from '@ionic-native/geolocation';
//import { GeolocationMarker } from 'geolocation-marker';
import { SMS } from '@ionic-native/sms';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from 'firebase/app';

declare var google: any;

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  circle:any;
  geolocation:Geolocation;
  
  latitude:number;
  longitude:number;
marker:any;
userid: any;
sendMsg: boolean;
public user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public sms:SMS, public toastCtrl:ToastController, public authService: AuthServiceProvider) {
    this.userid = authService.getCurrentUser();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
    this.sendMsg = false;
    
  //  var options = {
  //       enableHighAccuracy: false,
  //       timeout: 5000,
  //       maximumAge: 0
  //     };

  //     let watch = this.geolocation.watchPosition(options);
  //     watch.subscribe((position) => {
  //      //this.loadMap();
  //       if(this.circle!=null){
  //           if(google.maps.geometry.spherical.computeDistanceBetween( 
  //               new google.maps.LatLng( position.coords.latitude, position.coords.longitude ),
  //               new google.maps.LatLng( position.coords.latitude, position.coords.longitude )
  //             ) <= this.circle.radius){
  //               alert("In")
  //             }
  //             else{
  //               alert ("Out")
  //             }
  //       }

  //     });
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
  this.circle = new google.maps.Circle({
    map: this.map,
    center: new google.maps.LatLng(this.latitude,this.longitude),
    visible:true,
    radius:myradius,
    color:"RED",
    strokeColor:"RED"
    
    });
 
 
 this.checkRadius();

firebase.database().ref('users/'+this.userid).update({
   "radius": myradius,
   "cenLocLat":this.latitude,
   "cenLocLong":this.longitude
 });
} 
}

   loadMap(){
    
    //getting the current position 
    let locationOptions = {timeout: 20000, enableHighAccuracy: true};
 
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

      //marking the current position 
     
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
/*
  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = "<h4>Information!</h4>";         
   
    this.addInfoWindow(marker, content);
   
  }
*/
  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
   
  }

   //to check in and out
   checkRadius() {
     this. sendMsg = false;
 
     //checks if circle is present
   if(this.circle!= null){

     if(navigator.geolocation){

    let watch = navigator.geolocation.watchPosition((posi)=>{
        let from =this.circle.center;
        let to = new google.maps.LatLng(posi.coords.latitude,posi.coords.longitude);
        this.latitude = posi.coords.latitude;
        this.longitude = posi.coords.latitude;
        var LatLng = new google.maps.LatLng(this.latitude,this.longitude);
        this.marker.setPosition(to);
        if( this.circle.radius >= google.maps.geometry.spherical.computeDistanceBetween(from, to) ){
          
        }else{
         
          if (!this.sendMsg){
          this.send();
          this.sendMsg = true;
          }
        }

       this.authService.userAuthState.onAuthStateChanged(user => {
         //checks if user is logged in
         if(!user){
           navigator.geolocation.clearWatch(watch);
         }
       })
      })    
   
 }
   }
  }

  //the below method will send an sms to the caretaker if the patient moves out of the specified distance from his/her home
  send(){
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
          message: 'Failure',
          duration: 3000        });
        toast.present();
      });
  }

  updatecircle(){
    var radius,lat,long;
    //getting radius, center latitude and longitude of the circle
    firebase.database().ref('users/'+this.userid+'/radius').on('value',(snapshot) =>{
       radius = snapshot.val();
      

    })

    firebase.database().ref('users/'+this.userid+'/cenLocLat').on('value',(snapshot) =>{
       lat = snapshot.val();
      

    })

    firebase.database().ref('users/'+this.userid+'/cenLocLong').on('value',(snapshot) =>{
       long = snapshot.val();
      

    })
    console.log(radius+","+lat+","+long);
    
      this.addDynamicRadius(radius,lat,long);
      
    
  }

  // load previously stored circle 
  addDynamicRadius(rad,lat,long){
    
    var myradius = rad;
    
    
    if (myradius!=0){
           
            if(this.circle!= null){
              this.circle.setMap(null);
              this.circle = null;
              console.log(this.circle);
            }
            


            //adding a radius
  this.circle = new google.maps.Circle({
    map: this.map,
    center: new google.maps.LatLng(lat,long),
    visible:true,
    radius:myradius,
    color:"RED",
    strokeColor:"RED"
    
    });
  }
  else {
    alert("No Values set previously");
  }
}
}