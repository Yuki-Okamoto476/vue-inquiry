import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';

Vue.use(firestorePlugin)

const firebaseApp = firebase.initializeApp({
  // ここにfirebaseのapi情報をコピペします。
  apiKey: "AIzaSyCWFrSPI-sNfRYa9d8sLd6rYfHY1SN3h-I",
  authDomain: "vue-chat-35a02.firebaseapp.com",
  projectId: "vue-chat-35a02",
  storageBucket: "vue-chat-35a02.appspot.com",
  messagingSenderId: "594566221958",
  appId: "1:594566221958:web:27ac8e496ed109441a0107"
});

export const db = getFirestore(firebaseApp);