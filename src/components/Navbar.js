import React, {Component} from 'react';
import Swal from 'sweetalert2';
import {Button, Level, Tag, Card} from 'reactbulma';
import '../Style/Navbar.css'
import firebase from '../Firebase';
var db = firebase.firestore();
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logout = this
            .logout
            .bind(this);
        this.handleLongout = this
            .handleLongout
            .bind(this);
        this.handleClick = this
            .handleClick
            .bind(this);
        this.state = {
            name: "No login",
            uid: 'Loading ...',
            email: "Loading ...",
            position: "Loading ...",
            notify: 'dropdown is-right',
            notift_num: 10
        };
    }
    logout() {
        firebase
            .auth()
            .signOut();
    };
    componentDidMount() {

        this.getUserData();

    }
    getUserData = () => {
        const userId = firebase
            .auth()
            .currentUser
            .uid
        
        const userdataRef = db
            .collection('users')
            .doc(userId);
            

         userdataRef
            .get()
            .then(doc => {
                if (!doc.exists) {
                   console.log('No such document!');
                } else {
                   // console.log('Document data:', doc.data());
                    this.setState({
                        name: doc
                            .data()
                            .name,
                        email: doc
                            .data()
                            .email,
                        position: doc
                            .data()
                            .position,
                        uid: doc
                            .data()
                            .uid
                    });
                }
            })
            .catch(err => {
              //  console.log('Error getting document', err);
            });

    }

    handleClick() {
        this.setState(state => ({
            notify: !state.notify
        }));
    }
    handleLongout() {
        Swal
            .fire({
            title: 'Are you sure to logout?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: ' Yes, Logout'
        })
            .then((result) => {
                if (result.value) {
                    this.logout()
                    Swal.fire('Logout!', 'success', 'success')
                }
            })
    }

    render() {
        const {name, position} = this.state;
        return (
            <div>
                <Card>
                    <Level className="Nav_login">
                        <Level.Item>
                            <Level.Right>
                                <div>
                                    <Tag
                                        info
                                        large
                                        style={{
                                        marginRight: '10px'
                                    }}>
                                        <i
                                            className="fas fa-user"
                                            style={{
                                            marginRight: '5px'
                                        }}></i>
                                        <h1>
                                            {name}
                                        </h1>
                                    </Tag>
                                    < Tag success large>
                                        Login as {position
}
                                    </Tag>
                                    <Button danger onClick={this.handleLongout} className="logout_btn">
                                        Logout
                                    </Button>
                                </div>
                            </Level.Right>
                        </Level.Item>
                    </Level>
                </Card>
            </div>
        );
    }
}

export default Navbar;