import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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