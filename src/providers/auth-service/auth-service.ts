import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthServiceProvider {
  user: Observable<firebase.User>;

  public userProfile: any;
  userAuthState: any;

  constructor(private firebaseAuth: AngularFireAuth, public afDatabase: AngularFireDatabase) { 
    this.userAuthState = firebaseAuth.auth;

    this.userProfile = firebase.database().ref('users');

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
  }

  resetPassword(email: string) {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  logout(){
    return this.firebaseAuth.auth.signOut();
    
  }

  getCurrentUser(): any {
    return this.firebaseAuth.auth.currentUser.uid;
  }

}