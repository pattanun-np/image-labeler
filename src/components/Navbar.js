import React, {Component} from 'react';
import {
    Button,
    Card,
    Level,
    Heading,
    Title,
    Container,
    Hero,
    Nav,
    SubTitle,
    Progress,
    Tabs,
    Image,
    Field,
    Icon,
    Control,
    Tag,
    Notification,
    // Control
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

        this.state = {
            name: "No login",
            uid: '',
            email: "Loading ...",
            position: "Loading ..."
        };
    }
    logout() {
        firebase
            .auth()
            .signOut();
    };
    componentDidMount() {
        console.log("fetching data ...");
        this.getUserData();
        console.log("done");
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
    render() {
        const {name, position} = this.state;
        return (
            <div>
                <Nav className="navicon">
                    <Container>
                        <Nav.Left>
                            <Nav.Item>
                                <Image
                                    is="24x24"
                                    href="https://github.com/pattaunNP/image-labeler"
                                    src="https://image.flaticon.com/icons/svg/23/23957.svg"
                                    style={{
                                    marginRight: '10px'
                                }}/>
                                <Title is="6">GitHub Repository</Title>
                            </Nav.Item>
                        </Nav.Left>

                        <Nav.Toggle/>
                        <Nav.Right>
                            <Tag primary medium>{name}</Tag>
                            <Tag info medium>{position}</Tag>
                        </Nav.Right>

                        <Button
                            danger
                            onClick={this.logout}
                            style={{
                            marginleft: '100px'
                        }}>Logout</Button>

                        <Nav.Toggle/>
                    </Container>
                </Nav>
            </div>
        );
    }
}

export default Navbar;