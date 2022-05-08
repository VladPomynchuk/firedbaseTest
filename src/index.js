import './sass/main.scss';

//Firebase Authentication

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserNonePersistence,
} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

import { getDatabase, ref, set, push, get, update, remove, onValue, off } from 'firebase/database';

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

const db = getDatabase(app);

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

      function onClickLog(e) {
        signOut(auth)
          .then(e => {
            console.log('onClickLog');
          })
          .catch(e => {
            console.log('error off');
          });
        document.querySelector('.btnOpen').classList.toggle('visually-hidden');
        document.querySelector('.btnSignOut').classList.toggle('visually-hidden');
        document.querySelector('.btnSignOut').removeEventListener('click', onClickLog);
        document.querySelector('.userName').classList.toggle('visually-hidden');
        document.querySelector('.userName').textContent = '';
        document.querySelector('#savedFilmsList').innerHTML = '';
      }

      document.querySelector('.userName').classList.toggle('visually-hidden');
      document.querySelector('.userName').textContent = authResult.user.displayName;
    },
  },
};

document.querySelector('.btnOpen').addEventListener('click', uiStart);

function uiStart(e) {
  ui.start('#firebaseui-auth-container', uiConfig);
}

setPersistence(auth, browserSessionPersistence); // Session, Local, None

//Database

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
      // function writeUserData(userId, name, email) {
      //   console.log('запись');
      //   const db = getDatabase();
      //   set(ref(db, 'users/' + userId), {
      //     username: name,
      //     email: email,
      //   });
      // }
      // writeUserData(uid, displayName, email);

      // addData ----------------------------------------------------------------------
      const filmsRef = ref(db, 'users/' + uid + '/films');
      // document.querySelector('.database').classList.remove('visually-hidden');
      // document.querySelector('.addData').addEventListener('click', addData);
      // function addData(e) {
      //   e.preventDefault();

      //   if (document.querySelector('.input').value.trim() !== '') {
      //     console.log(document.querySelector('.input').value.trim());
      //     const inputText = document.querySelector('.input').value.trim();
      //     function updateFilms(filmId) {
      //       const updateRef = ref(db, 'users/' + uid + '/films/' + filmId);
      //       const updates = {};
      //       updates['users/' + uid + '/films/' + inputText] = inputText;
      //       update(ref(db), updates);
      //     }
      //     updateFilms(inputText);
      //   }
      // }

      // saveFilm
      const saveFilmsRef = ref(db, 'users/' + uid + '/films');
      document.querySelectorAll('.saveBtn').forEach(e => e.addEventListener('click', saveFilm));
      function saveFilm(e) {
        const filmID = e.target.parentNode.parentNode.parentNode.id;

        function addFilmToBase(filmID) {
          document.querySelector('.filmList__item').id;
          const filmPoster = e.target.parentNode.parentNode.querySelector('img').src;

          const filmObj = { filmID, filmPoster };

          const updates = {};

          updates['users/' + uid + '/films/' + filmID] = filmObj;
          update(ref(db), updates);
        }

        addFilmToBase(filmID);
      }

      // const filmsRef = ref(db, 'users/' + uid + '/films');

      //get films --------------------------------------------------------------------
      //   const filmsArray = get(filmsRef)
      //     .then(snapshot => {
      //       if (snapshot.exists()) {
      //         return Object.values(snapshot.val());
      //       } else {
      //         console.log('No data available');
      //       }
      //     })
      //     .then(filmList => {
      //       if (filmList) {
      //         const filmString = filmList
      //           .map(({ filmID, filmPoster }) => {
      //             return `<li id="${filmID}" class="filmList__item">
      //   <div class="filmList__link">
      //     <div class="filmList__poster">
      //       <picture>
      //         <img
      //           src="${filmPoster}"
      //           alt="greyhound"
      //         />
      //       </picture>
      //     </div>
      //     <h2 class="filmList__title">greyhound</h2>
      //     <div class="filmList__info">
      //       <p class="filmList__text">
      //         <span class="filmList__genge">Drama, Action</span> |
      //         <span class="filmList__releaseDate">2020</span>
      //       </p>
      //       <div class="filmList__voteAverage visually-hidden">
      //         <p>10.0</p>
      //       </div>
      //       <button class="removeBtn">remove</button>
      //     </div>
      //   </div>
      // </li>`;
      //           })
      //           .join('');

      //         document.querySelector('#savedFilmsList').insertAdjacentHTML('afterbegin', filmString);
      //       }
      //     })
      //     .then(e => {
      //       document
      //         .querySelectorAll('.removeBtn')
      //         .forEach(e => e.addEventListener('click', removeBtn));
      //       function removeBtn(e) {
      //         const filmID = e.target.parentNode.parentNode.parentNode.id;
      //         console.log(filmID);
      //         const removeFilmRef = ref(db, 'users/' + uid + '/films/' + filmID);
      //         remove(removeFilmRef);
      //         console.log('remove');
      //       }
      //     })
      //     .catch(error => {
      //       console.error(error);
      //     });

      //onValue СЛУШАТЕЛЬ СОБЫТИЙ НА БАЗЕ ДАННЫХ --------------------------------------------
      const onValueRef = ref(db, 'users/' + uid + '/films');
      const snapshotFn = snapshot => {
        console.log('onValue start');
        document.querySelector('#savedFilmsList').innerHTML = '';
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          if (data) {
            const filmString = data
              .map(({ filmID, filmPoster }) => {
                return `<li id="${filmID}" class="filmList__item">
      <div class="filmList__link">
        <div class="filmList__poster">
          <picture>
            <img
              src="${filmPoster}"
              alt="greyhound"
            />
          </picture>
        </div>
        <h2 class="filmList__title">greyhound</h2>
        <div class="filmList__info">
          <p class="filmList__text">
            <span class="filmList__genge">Drama, Action</span> |
            <span class="filmList__releaseDate">2020</span>
          </p>
          <div class="filmList__voteAverage visually-hidden">
            <p>10.0</p>
          </div>
          <button class="removeBtn">remove</button>
        </div>
      </div>
    </li>`;
              })
              .join('');

            document.querySelector('#savedFilmsList').insertAdjacentHTML('afterbegin', filmString);
          }
          document
            .querySelectorAll('.removeBtn')
            .forEach(e => e.addEventListener('click', removeBtn));
          function removeBtn(e) {
            const filmID = e.target.parentNode.parentNode.parentNode.id;
            console.log(filmID);
            const removeFilmRef = ref(db, 'users/' + uid + '/films/' + filmID);
            remove(removeFilmRef);
            console.log('remove');
          }
        }
      };
      onValue(onValueRef, snapshotFn);

      document.querySelector('.btnSignOut').addEventListener('click', removeOnValue);

      function removeOnValue() {
        off(ref(db, 'users/' + uid + '/films/'));
        console.log('removeOnValue');
      }

      // console.log(Object.values(filmsArray));
    } else {
      console.log('user singOut');
      // document.querySelector('.database').classList.add('visually-hidden');
    }
  },
  function (error) {
    console.log(error);
  },
);

//Firebase Storage---------------------------------------------------------------------

// import { doc, getFirestore } from 'firebase/firestore';

// const firestore = getFirestore(app);

// import { collection, addDoc, getDocs } from 'firebase/firestore';

// const addDocument = async () => {
//   try {
//     const docRef = await addDoc(collection(firestore, 'users'), {
//       first: 'Ada',
//       last: 'Lovelace',
//       born: 1815,
//     });
//     console.log('Document written with ID: ', docRef.id);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//     // console.log('Авторизируйся!!!');
//   }
// };

// const addUser = async () => {
//   try {
//     const docRef = await addDoc(collection(firestore, 'users'), {
//       first: 'Alan',
//       middle: 'Mathison',
//       last: 'Turing',
//       born: 1912,
//     });

//     console.log('Document written with ID: ', docRef.id);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// };

// const getCollection = async () => {
//   const querySnapshot = await getDocs(collection(firestore, 'users'));
//   querySnapshot.forEach(doc => {
//     console.log(`${doc.id} => ${doc.data()}`);
//   });
// };

// document.querySelector('.addDocument').addEventListener('click', addDocument);
// document.querySelector('.addUser').addEventListener('click', addUser);
// document.querySelector('.getCol').addEventListener('click', getCollection);
