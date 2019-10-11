import React, {Component} from 'react';
import './Login.css';
import Modal from "./Modal";
import Swal from 'sweetalert2'
import {withRouter} from "react-router";
import {
    Button,
    Card,
    Input,
    Notification,
    Tabs,
    Delete,
    Image,
    Field,
    Control,
    Checkbox,
    Link
} from 'reactbulma'
import firebase from '../firebase';
const DB = firebase.database();

class Login extends Component {
    constructor(props) {

        super(props);

        this.login = this
            .login
            .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.signup = this
            .signup
            .bind(this);

        this.handleEntailmentRequest = this
            .handleEntailmentRequest
            .bind(this);
        this.state = {
            name: '',
            email: '',
            password: '',
            currentUser: '',
            message: '',
            register: 'Tabs2',
            position: ''
        }
    }

    login(e) {
        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                 Swal.fire(
                     'Good job! Login',
                     'success',
                     'success'
                 )
                setTimeout(() => this.props.history.push("/dashboard"), 100);

            })
            .catch((error) => {
                console.log(error);
                this.setState({message: error.message})
                setTimeout(() => this.setState({message: null}), 2000);
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
                Swal.fire(
                    'Good job!',
                    'Create User Success',
                    'success'
                )
                this
                    .props
                    .history
                    .push("/");
                this.setState({register: 'Tabs2'})

                DB
                    .ref('/data')
                    .child('users/' + userId)
                    .set({name: this.state.name, email: this.state.email, position: this.state.position, uid: userId})

            })
            .catch((error) => {
                console.log(error);
                this.setState({message: error.message});
                setTimeout(() => this.setState({message: null}), 2000);

            })

    }
    handleEntailmentRequest(e) {
        e.preventDefault();
        console.log(e.target.value)
        this.setState({position: e.target.value})
        //  console.log(this.state.position,"selected")

    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const {message} = this.state
        return (
            <div>
                {message
                    ? <Notification danger>
                            {message}
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

                                <a className="Tabs"><Image is="16x16" src="https://image.flaticon.com/icons/svg/40/40358.svg"/>
                                    <span >
                                        SignUp
                                    </span>
                                </a>
                            </li>
                            <li
                                className={this.state.register === 'Tabs2' && 'is-active'}
                                onClick=
                                {() => { this.setState({register: 'Tabs2'}) } }>
                                <a className="Tabs"><Image is="16x16" src="https://image.flaticon.com/icons/svg/149/149071.svg"/>
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
                                        type="text"
                                        placeholder="Name"
                                        value={this.state.name}
                                        name="name"
                                        id="InputName"
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
                                What is your position please select your position in this project ?</h1>
                            <Field grouped>
                                <Control>
                                    <Button
                                        success
                                        className="button is-link"
                                        value='Dentist(Advicer)'
                                        onClick=
                                        { (e) => { this.handleEntailmentRequest(e) } }>
                                        Dentist(Advicer)</Button>
                                </Control>
                                <Control>
                                    <Button
                                        danger
                                        className="button is-link"
                                        value="Dentist(Student)"
                                        onClick=
                                        { (e) => { this.handleEntailmentRequest(e) } }>
                                        Dentist(Student)</Button>
                                </Control>
                                <Control>
                                    <Button
                                        warning
                                        className="button is-link"
                                        value="Engineer(Co-Advicer)"
                                        onClick=
                                        { (e) => { this.handleEntailmentRequest(e) } }>
                                        Engineer(Co-Advicer)</Button>
                                </Control>
                                <Control>
                                    <Button
                                        info
                                        className="button is-link"
                                        value="Reseacher"
                                        onClick=
                                        { (e) => { this.handleEntailmentRequest(e) } }
                                        onClick=
                                        { (e) => { this.handleEntailmentRequest(e) } }>
                                        Researcher</Button>
                                </Control>
                            </Field>

                            <h1 className="label">Selected : {this.state.position}</h1>
                            <div className="field is-grouped">
                                <div className="control">
                                    <Button primary className="button is-link" onClick={this.signup}>Submit</Button>
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
                                        value={this.state.email}
                                        name="email"
                                        id="InputEmail"
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
                                        value={this.state.password}
                                        name="password"
                                        id="InputPassword"
                                        onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="control">
                                    <Button primary className="button is-link" type="submit" onClick={this.login}>Login</Button>
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