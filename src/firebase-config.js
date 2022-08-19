import { initializeApp } from "firebase/app";
import {collection, getFirestore} from 'firebase/firestore'
import {getDatabase} from 'firebase/database'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

initializeApp(firebaseConfig);

export const db = getFirestore()
export const auth = getAuth()
export const realtimedb = getDatabase()
export const storageref = getStorage()

export const colBooks = collection(db, 'books')