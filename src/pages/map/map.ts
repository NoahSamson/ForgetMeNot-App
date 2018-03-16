import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker,
 Circle
} from '@ionic-native/google-maps';

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

  //latlang new variables 
  latitude:any;
  longitute:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }

  addRadius(){
    
    var myradius = parseInt(prompt("Enter radius in meters"));
    
    let locationOptions = {timeout: 20000, enableHighAccuracy: true};
 
    navigator.geolocation.getCurrentPosition(
 
        (position) => {
 
            let options = {
              center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP,			
            }

            if(this.circle!= null){
              this.circle.setMap(null);
              this.circle = null;
              console.log(this.circle);
            }
            


            //adding a radius
  this.circle = new google.maps.Circle({
    map: this.map,
    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    visible:true,
    radius:myradius,
    color:"RED",
    strokeColor:"RED"
    
    });

    this.checkRadius();
    
    
    
  },
 
  (error) => {
      console.log(error);
  }, locationOptions
);




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
              this.longitute=position.coords.longitude;
            //

           

            
			
			//marking the current position 
			let marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
			});
        
      

        },
 
        (error) => {
            console.log(error);
        }, locationOptions
    );


   
    
  }

    //to check in and out
   checkRadius() {
    if(this.circle!= null){

      if(navigator.geolocation){

        let from =this.circle.center;
        let to = new google.maps.LatLng(this.latitude,this.longitute);
        if(google.maps.geometry.spherical.computeDistanceBetween(from, to) <= this.circle.radius){
          alert("in");
        }else{
          alert("out");
        }
    
  }
    }
    this.checkRadius();
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

}
