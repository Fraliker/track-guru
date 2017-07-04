import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}
  /*
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithFacebook() {
    return firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logout() {
    return firebase.auth().signOut();
  }
}
