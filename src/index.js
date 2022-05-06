import './sass/main.scss';

import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const app = initializeApp({
  apiKey: 'AIzaSyABsZXdDsm_xgBjGoNcvwNKa3dhBitS3oY',
  authDomain: 'test-8b985.firebaseapp.com',
  projectId: 'test-8b985',
  storageBucket: 'test-8b985.appspot.com',
  messagingSenderId: '1092771081847',
  appId: '1:1092771081847:web:3ed7634c4e339dccbba072',
});

const auth = getAuth(app);

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

var ui = new firebaseui.auth.AuthUI(auth);

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '#',
  signInFlow: 'popup',
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      document.querySelector('.btnOpen').textContent = 'SignOut';
      document.querySelector('.backdrop').classList.toggle('is-hidden');
      document.querySelector('.btnOpen').removeAttribute('data-modal-open');
      document.querySelector('.btnOpen').classList.add('logOut');

      document.querySelector('.logOut').addEventListener('click', onClickLog);

      function onClickLog(e) {
        auth.signOut().then(e => {
          console.log('+').catch(e => {
            console.log('error');
          });
        });
      }
    },
  },
});

onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(uid);
    console.log(user.email);

    // ...
  } else {
    // User is signed out
    // ...
  }
});
