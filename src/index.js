import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
<<<<<<< HEAD
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
=======
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware,compose } from 'redux'
import rootReducer from './Redux-store/Redux-reducer/rootReducer'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import {
    ReactReduxFirebaseProvider
} from 'react-redux-firebase'
import {
    createFirestoreInstance
} from 'redux-firestore'
import fbConfig from './Firebase/index'
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true ,// Firestore for Profile instead of Realtime DB
    enableClaims: true // Get custom claims along with the profile
}
const rrfProps = {
    config: rrfConfig,
    createFirestoreInstance // <- needed if using firestore
}

const initialState = {}
const store = createStore(rootReducer,initialState);

ReactDOM.render(<Provider store={store}> <App /></Provider>, document.getElementById('root'))
registerServiceWorker()
>>>>>>> bec1b36af0632a9d39c0b135cc89c94fce450447
