import React, {Component} from 'react';
import {
    Button,
    Title,
    Container,
    Nav,
    Image,
    Level,
    Heading,
    Tag
} from 'reactbulma';
import './Navbar.css'
import firebase from '../firebase';
var DB = firebase.database();
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logout = this
            .logout
            .bind(this);
this.handleClick = this.handleClick.bind(this);
        this.state = {
            name: "No login",
            uid: 'Loading ...',
            email: "Loading ...",
            position: "Loading ...",
            notify: 'dropdown is-right',
            notift_num:10
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
        const user = firebase
            .auth()
            .currentUser
            .uid;
        const userdataRef = DB
            .ref('/data')
            .child('users/' + user);

        userdataRef.on('value', (snapshot) => {
            var getuserdata = snapshot.val();

            this.setState({name: getuserdata.name, email: getuserdata.email, position: getuserdata.position, uid: getuserdata.uid});

        });
    }
    handleClick() {
        this.setState(state => ({
            notify: !state.notify
        }));
    }
    render() {
        const {name, position} = this.state;
        return (
            <div>
                < Level style = {
                    {
                        marginTop: '10px',
                        marginBottom: '10px'
                    }
                } >
                    <Level.Item hasTextCentered>
                        <div>
                           
                        </div>
                    </Level.Item>
                    <Level.Item hasTextCentered>
                        <div></div>
                    </Level.Item>
                    <Level.Item hasTextCentered>
                        <div></div>
                    </Level.Item>
                    <Level.Item hasTextCentered>
                        <div>
                            <Tag
                                info large
                                style={{
                                marginRight: '10px'
                            }}>
                                < i class = "fas fa-user"
                                style = {
                                    {
                                        marginRight: '5px'
                                    }
                                } > </i>
                                <h1>
                                    {name}
                                </h1>
                            </Tag>
                            <Button
                             className = {
                                     this.state.notify ? 'dropdown is-right ':'dropdown is-right is-active'}
                                aria-haspopup="true"
                                aria-controls="dropdown-menu6"
                                onClick = {
                                    this.handleClick
                                }
                                style={{
                                marginRight: '10px'
                            }
                            }>
                                < i className="fas fa-bell"></i>
                                <div class="dropdown-trigger"></div>
                                <div class="dropdown-menu" id="dropdown-menu6" role="menu">
                                    <div class="dropdown-content">
                                        <div class="dropdown-item">
                                            <ul>
                                                <li>
                                                    Notify
                                                </li>
                                                <li>
                                                    Notify
                                                </li>
                                                <li>
                                                    Notify
                                                </li>
                                                <li>
                                                    Notify
                                                </li>
                                                <li>
                                                    Notify
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                 < Tag danger style = {
                                     {
                                         marginLeft: '5px'
                                     }
                                 }>{this.state.notift_num}</Tag>
                            </Button>
                            <Button
                                danger
                                onClick={this.logout}
                                style={{
                                marginLeft: '10px'
                            }}>
                                Logout
                            </Button>
                        </div>
                    </Level.Item>
                </Level>
            </div>
        );
    }
}

export default Navbar;