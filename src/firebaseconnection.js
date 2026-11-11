import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBV8sJw9Yp3TEbJ7uNNH40-F2AJkoEHe5w',
  authDomain: 'react-8e768.firebaseapp.com',
  projectId: 'react-8e768',
  storageBucket: 'react-8e768.firebasestorage.app',
  messagingSenderId: '513457158231',
  appId: '1:513457158231:web:8f98a4aaf01b3c480ecb12',
  measurementId: 'G-3NCMEC8NS2'
}

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }
