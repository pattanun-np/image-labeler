import React, {Component} from 'react';
import firebase from './firebase'
import Home from './components/Home';
import Page from './components/single-page';
import Loading from './components/Loading';
import PrivateRoute from './components/PrivateRoute';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from 'axios'
require('dotenv').config()
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            message: '',
            loading: true,
            authenticated: false,
            user: null,
            register: 'Tabs1',
            position: "Undefind"
        }
    }
    componentWillMount() {
        firebase
            .auth()
            .onAuthStateChanged(user => {
                if (user) {
                    this.setState({authenticated: true, currentUser: user, loading: false});
                } else {
                    this.setState({authenticated: false, currentUser: null, loading: false});
                }
            });
    }
     render() {
        const {authenticated, loading} = this.state;

        if (loading) {
            return <Loading/>;
        }
        return (

            <Router>
                <div>
                    <PrivateRoute
                        exact
                        path="/dashboard"
                        component={Page}
                        authenticated={authenticated}/>

                    <Route exact path="/" component={Home}/>

                </div>
            </Router>

        );
    }
}

export default App;
