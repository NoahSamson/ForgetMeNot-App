import { LoginPage } from './../../pages/login/login';
import { User } from './../../models/user.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthServiceProvider {
  user: Observable<firebase.User>;

  public userProfile: any;

  constructor(private firebaseAuth: AngularFireAuth, public afDatabase: AngularFireDatabase) { 
    this.user = firebaseAuth.authState;

    this.userProfile = firebase.database().ref('users');

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        //User Signed in
      }else{
        //user not logged in
        this.rootPage = LoginPage;
      }
    });
  }

  signup(email: string, password: string){
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(value =>{
      console.log('Success', value);
    }).catch(err =>{
      console.log('ERROR!!', err.message);
    });
  }

  signupService(account: {}){
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(account['email'], account['password']).then((newUser) =>{
      //sign in user
      this.firebaseAuth.auth.signInWithEmailAndPassword(account['email'], account['password']).then((authenticatedUser) =>{
        //Successful login create user Profile
        this.userProfile.child(authenticatedUser.uid).set(
          account
        );
      });
    });
  }

  login(email: string, password: string):any{
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
    // .then(value =>{
    //   console.log('Logged in');
    // }).catch(err =>{
    //   console.log('ERROR!!', err.message);
    // });
  }

  logout(){
    this.firebaseAuth.auth.signOut();
  }

}

