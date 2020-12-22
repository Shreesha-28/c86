import firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyA7wzk5ag739RxPAZMHpKZlgq9w1gywPVA",
    authDomain: "booksanta-2703e.firebaseapp.com",
    databaseURL: "https://booksanta-2703e.firebaseio.com",
    projectId: "booksanta-2703e",
    storageBucket: "booksanta-2703e.appspot.com",
    messagingSenderId: "85770531559",
    appId: "1:85770531559:web:14b0b3a10f3e8c7e4e2842",
    measurementId: "G-0SS81J4KQV"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()