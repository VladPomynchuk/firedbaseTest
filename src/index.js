import './sass/main.scss';

//Firebase Authentication

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const app = initializeApp({
  apiKey: 'AIzaSyABsZXdDsm_xgBjGoNcvwNKa3dhBitS3oY',
  authDomain: 'test-8b985.firebaseapp.com',
  projectId: 'test-8b985',
  databaseURL: 'https://test-8b985-default-rtdb.europe-west1.firebasedatabase.app/',
  storageBucket: 'test-8b985.appspot.com',
  messagingSenderId: '1092771081847',
  appId: '1:1092771081847:web:3ed7634c4e339dccbba072',
});

const auth = getAuth(app);

var ui = new firebaseui.auth.AuthUI(auth);

var uiConfig = {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInFlow: 'popup',
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      document.querySelector('[data-modal]').classList.toggle('is-hidden');
      document.querySelector('.btnOpen').classList.toggle('visually-hidden');
      document.querySelector('.btnSignOut').classList.toggle('visually-hidden');
      document.querySelector('.btnSignOut').addEventListener('click', onClickLog);

      document.querySelector('.userName').classList.toggle('visually-hidden');
      document.querySelector('.userName').textContent = authResult.user.displayName;

      function onClickLog(e) {
        auth
          .signOut()
          .then(e => {
            console.log('logOut');
          })
          .catch(e => {
            console.log('error');
          });
        document.querySelector('.btnOpen').classList.toggle('visually-hidden');
        document.querySelector('.btnSignOut').classList.toggle('visually-hidden');
        document.querySelector('.btnSignOut').removeEventListener('click', onClickLog);
        document.querySelector('.userName').classList.toggle('visually-hidden');
        document.querySelector('.userName').textContent = '';
      }
    },
  },
};

document.querySelector('.btnOpen').addEventListener('click', uiStart);

function uiStart(e) {
  ui.start('#firebaseui-auth-container', uiConfig);
}

setPersistence(auth, browserSessionPersistence); // Session, Local, None

//Database

import { getDatabase, ref, set, push, get, update } from 'firebase/database';

const db = getDatabase(app);

onAuthStateChanged(
  auth,
  function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function (accessToken) {
        // console.log('onAuthStateChanged: accessToken', accessToken);
      });

      // console.log(user);
      // Сздаем ячейку в databse при авторизации
      function writeUserData(userId, name, email) {
        console.log('запись');
        const db = getDatabase();
        set(ref(db, 'users/' + userId), {
          username: name,
          email: email,
        });
      }
      // writeUserData(uid, displayName, email);

      // addData
      const filmsRef = ref(db, 'users/' + uid + '/films');
      document.querySelector('.database').classList.remove('visually-hidden');
      document.querySelector('.addData').addEventListener('click', addData);
      function addData(e) {
        e.preventDefault();

        if (document.querySelector('.input').value.trim() !== '') {
          console.log(document.querySelector('.input').value.trim());
          const inputText = document.querySelector('.input').value.trim();
          function updateFilms(filmId) {
            const updateRef = ref(db, 'users/' + uid + '/films/' + filmId);
            const updates = {};
            updates['users/' + uid + '/films/' + inputText] = inputText;
            update(ref(db), updates);
          }
          updateFilms(inputText);
        }
      }

      // saveFilm
      // const filmsRef = ref(db, 'users/' + uid + '/films');

      //get films
      const filmsArray = get(filmsRef)
        .then(snapshot => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            console.log(Object.values(snapshot.val()));
            return Object.values(snapshot.val());
          } else {
            console.log('No data available');
          }
        })
        .then(filmList => {
          document.querySelector('.container').insertAdjacentHTML(
            'afterbegin',
            filmList
              .map(film => {
                return `<p>${film}</p>`;
              })
              .join(''),
          );
        })
        .catch(error => {
          console.error(error);
        });

      // console.log(Object.values(filmsArray));
    } else {
      document.querySelector('.database').classList.add('visually-hidden');
    }
  },
  function (error) {
    console.log(error);
  },
);

//Firebase Storage

import { doc, getFirestore } from 'firebase/firestore';

const firestore = getFirestore(app);

import { collection, addDoc, getDocs } from 'firebase/firestore';

const addDocument = async () => {
  try {
    const docRef = await addDoc(collection(firestore, 'users'), {
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
    // console.log('Авторизируйся!!!');
  }
};

const addUser = async () => {
  try {
    const docRef = await addDoc(collection(firestore, 'users'), {
      first: 'Alan',
      middle: 'Mathison',
      last: 'Turing',
      born: 1912,
    });

    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const getCollection = async () => {
  const querySnapshot = await getDocs(collection(firestore, 'users'));
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
};

document.querySelector('.addDocument').addEventListener('click', addDocument);
document.querySelector('.addUser').addEventListener('click', addUser);
document.querySelector('.getCol').addEventListener('click', getCollection);
