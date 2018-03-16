import { LoginPage } from './../../pages/login/login';
import { User } from './../../models/user.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthServiceProvider {
  userstate: Observable<firebase.User>;

  user = {} as User;

  public userProfileRef: any;
  public userCreateRef: any;

  constructor(private firebaseAuth: AngularFireAuth, public afDatabase: AngularFireDatabase) { 
    this.userstate = firebaseAuth.authState;

    const userCreateRef = firebase.database().ref('users');

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
         = user;
        //this.rootPage = UserPage;
      }else{ 
        //user not logged in
        this.rootPage = LoginPage;
      }
    });
  }

  getDatabaseRef(): any {
     var database = firebase.database();
    return database;
  }

  signupService(account: {}){
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(account['email'], account['password']).then((newUser) =>{
      //sign in user
      this.firebaseAuth.auth.signInWithEmailAndPassword(account['email'], account['password']).then((authenticatedUser) =>{
        //Successful login create user Profile
        this.userCreateRef.child(authenticatedUser.uid).set(
          account
        );
      });
    });

    
  }

  login(email: string, password: string):any{
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    this.firebaseAuth.auth.signOut();
  }

  getCurrentUser(): any {
    return this.firebaseAuth.auth.currentUser.uid;
  }

  getUserprofileRef(uid){
    const userProfileRef = firebase.database().ref('user/'+uid);
    return userProfileRef;
  }

}

