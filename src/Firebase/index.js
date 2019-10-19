import firebase from 'firebase';
import config from './config'
import 'firebase/auth/'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore'

firebase.initializeApp(config);
export default firebase;