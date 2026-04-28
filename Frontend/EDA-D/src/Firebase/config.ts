import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCTyA5eo6GW8XIb8vdAKiNgX-tL581VX6c',
  authDomain: 'eda-final.firebaseapp.com',
  projectId: 'eda-final',
  storageBucket: 'eda-final.firebasestorage.app',
  messagingSenderId: '314343702364',
  appId: '1:314343702364:web:130bfee524c4e612570b99',
  measurementId: 'G-PRMEEDFJ5X',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, analytics, db, auth }
