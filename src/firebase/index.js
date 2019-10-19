import firebase from 'firebase';
import config from './config'
import 'firebase/auth/'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore'

firebase.initializeApp(config);
firebase.firestore().settings({timestampsInSnapshots:true})
export default firebase;