import React, {Component} from 'react';
import './Login.css';
import {withRouter} from "react-router";
import {
    Button,
    Card,
    Input,
    Field,
    Notification,
    Tabs,
    Delete,
    Image
} from 'reactbulma'
import firebase from '../firebase';
const DB = firebase.database();

class Login extends Component {
    constructor(props) {

        super(props);

        this.state = this.initialState;

        this.login = this
            .login
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.signup = this
            .signup
            .bind(this);
        this.handleClose = this
            .handleClose
            .bind(this);
        this.reset = this
            .reset
            .bind(this);
        this.state = {
            name: '',
            email: '',
            password: '',
            currentUser: '',
            message: '',
            register: 'Tabs2',
            position: "Undefind please select!"
        }
    }
    get initialState() {
        return {
            name: '',
            email: '',
            password: '',
            message: '',
            register: 'Tabs1',
            position: "Undefind please select!"
        };
    }

    reset() {
        this.setState(this.initialState);
    }
    login(e) {
        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                console.log(" Login success")
                this
                    .props
                    .history
                    .push("/");
            })
            .catch((error) => {
                console.log(error);
                this.setState({message: error.message})
            });

    }
    signup(e) {
        e.preventDefault();

        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                var userId = firebase
                    .auth()
                    .currentUser
                    .uid;
                console.log("Create User Success")
                this
                    .props
                    .history
                    .push("/");

                DB
                    .ref('/data')
                    .child('users/' + userId)
                    .set({name: this.state.name, email: this.state.email, position: this.state.position, uid: userId})

            })
            .catch((error) => {
                console.log(error);
                this.setState({message: error.message});

            })

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClose() {
        this.setState({message: null})
    }

    render() {
        const {message} = this.state
        return (
            <div>
                <h2>{this.state.currentUser}</h2>
                {message
                    ? <Notification danger>
                            <Delete onClick={this.handleClose}/> {message}
                        </Notification>
                    : null}
                <Card className="signIn">
                    <Tabs centered boxed>
                        <ul>
                            <li
                                className={this.state.register === 'Tabs1' && 'is-active'}
                                onClick={() => {
                                this.setState({register: 'Tabs1'})
                            }}>

                                <a href='#signup' className="Tabs"><Image is="16x16" src="https://image.flaticon.com/icons/svg/40/40358.svg"/>
                                    <span >
                                        SignUp
                                    </span>
                                </a>
                            </li>
                            <li
                                className={this.state.register === 'Tabs2' && 'is-active'}
                                onClick=
                                {() => { this.setState({register: 'Tabs2'}) } }>
                                <a href='#login' className="Tabs"><Image is="16x16" src="https://image.flaticon.com/icons/svg/149/149071.svg"/>
                                    <span>Login</span>
                                </a>
                            </li>

                        </ul >
                    </Tabs>
                    {this.state.register === 'Tabs1' && <div>
                        <h1 className="label">
                            Please Sign Up Before the record data</h1>
                        <form>
                            <div className="field">
                                <label className="label">Name :
                                </label>
                                <div className="Input-Box">
                                    <Input
                                        primary
                                        className="input"
                                        type="name"
                                        name="name"
                                        placeholder="Name"
                                        id="InputName"
                                        value={this.state.name}
                                        onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Email :
                                </label>
                                <div className="Input-Box">
                                    <Input
                                        primary
                                        className="input"
                                        placeholder="Email"
                                        type="email"
                                        name="email"
                                        id="InputEmail"
                                        value={this.state.email}
                                        onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Password :
                                </label>
                                <div className="Input-Box">
                                    <Input
                                        primary
                                        className="input"
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        id="InputPassword"
                                        value={this.state.password}
                                        onChange={this.handleChange}/>
                                </div>
                            </div>
                            <h1 className="label">
                                What is your position please select your position in this project</h1>
                            <Field grouped>

                                <div className="selectBTN1">
                                    <h1
                                        value="Dentist(Student)"
                                        onClick={() => this.setState({position: 'Dentist(Student)'})}>
                                        Dentist(Student)</h1>
                                </div>
                                <div className="selectBTN2">
                                    <h1
                                        value="Dentist(Advicer)"
                                        onClick={() => this.setState({position: 'Dentist(Advicer)'})}>
                                        Dentist(Advicer)</h1>
                                </div>
                                <div className="selectBTN3">
                                    <h1
                                        value=" Asoc. Prof. Engineer (Co-Advicer)"
                                        onClick={() => this.setState({position: 'Assoc. Prof. Engineer (Co-Advicer)'})}>
                                        Assoc. Prof. Engineer (Co-Advicer)</h1>
                                </div>
                                <div className="selectBTN4">
                                    <h1 value="Reseacher" onClick={() => this.setState({position: 'Researcher'})}>
                                        Reseacher</h1>
                                </div>

                            </Field>
                            <h1 className="label">Selected : {this.state.position}</h1>
                            <div className="field is-grouped">
                                <div className="control">
                                    <Button success className="button is-link" onClick={this.signup}>Submit</Button>
                                </div>
                                <div className="control">
                                    <Button danger className="button is-link" onClick={this.reset}>Cancel</Button>
                                </div>

                            </div>
                        </form>

                    </div>
}
                    {this.state.register === 'Tabs2' && <div>
                        <h1 className="label">Please Login Before the record data</h1>
                        <form>
                            <div className="field">
                                <label className="label">Email :
                                </label>
                                <div className="Input-Box">
                                    <Input
                                        primary
                                        className="input"
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        id="InputEmail"
                                        value={this.state.email}
                                        onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Password :
                                </label>
                                <div className="control">
                                    <Input
                                        primary
                                        className="input"
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        id="InputPassword"
                                        value={this.state.password}
                                        onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="control">
                                    <Button success className="button is-link" type="submit" onClick={this.login}>Login</Button>
                                </div>
                                <div className="control">
                                    <Button danger className="button is-link" onClick={this.reset}>Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>
}
                </Card>
            </div>
        );
    }
}
export default withRouter(Login);