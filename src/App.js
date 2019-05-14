import React, {Component} from 'react';
import firebase from './firebase'
import Home from './components/Home';
import Page from './components/single-page';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:null
        }
    }
    componentDidMount() {
        this.authListener();
    }
    authListener() {
        firebase
            .auth()
            .onAuthStateChanged((user) => {
                console.log(user);
                if (user) {
                    this.setState({user});
                    localStorage.setItem('user', user.uid);
                } else {
                    this.setState({user: null});
                    localStorage.removeItem('user');
                }
            });
    }
    render() {
        return (
            <div>

                {this.state.user
                    ? (<Page/>)
                    : (<Home/>)}

            </div>
        );
    }
}

export default App;
