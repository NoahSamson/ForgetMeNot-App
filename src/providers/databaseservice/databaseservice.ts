import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Firebase
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {Observable} from 'rxjs/Observable';

/*
  Generated class for the DatabaseserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseserviceProvider {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) { 
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string){
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(value =>{
      console.log('Success', value);
    }).catch(err =>{
      console.log('ERROR!!', err.message);
    });
  }

  login(email: string, password: string){
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then(value =>{
      console.log('Logged in');
    }).catch(err =>{
      console.log('ERROR!!', err.message);
    });
  }

  logout(){
    this.firebaseAuth.auth.signOut();
  }
}
