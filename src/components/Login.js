/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from 'react';
import '../Style/Login.css';
import Swal from 'sweetalert2'
import {withRouter} from "react-router";
import {
    Button,
    Level,
    Input,
    Notification,
    Tabs,
    Image,
    Field,
    Control
} from 'reactbulma'
import firebase from '../Firebase';
const DB = firebase.database();

class Login extends Component {
    constructor(props) {

        super(props);

        this.login = this
            .login
            .bind(this);
            this.signup = this
                .signup
                .bind(this);
        this.handleChange = this
            .handleChange
            .bind(this);
       

        this.state = {
            name: '',
            email: '',
            password: '',
            currentUser: '',
            message: '',
            register: 'Tabs2',
            position: 'Select your role'
        }
    }

    login(e) {
        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                Swal.fire('Good job! Login', 'success', 'success')
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
                Swal.fire('Good job!', 'Create User Success', 'success')
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
                setTimeout(() => this.setState({message: null}), 2000);

            })

    }
 

    handleChange = (e) => {

        this.setState({
            [e.target.name]: e.target.value

        });

    }

    render() {
        const {message} = this.state
        return (
            <div className="Card_Login">
                {message
                    ? <Notification danger>
                            {message}
                        </Notification>
                    : null}
                    <Tabs centered boxed>
                        <ul>
                            <li
                                className={this.state.register === 'Tabs1' && 'is-active'}
                                onClick={() => {
                                this.setState({register: 'Tabs1'})
                            }}>

                                < a className="Tabs"><Image is="16x16 " src=" https://image.flaticon.com/icons/svg/40/40358.svg"/>
                                    <span >
                                        SignUp
                                    </span>
                                </a>
                            </li>
                            <li
                                className={this.state.register === 'Tabs2' && 'is-active'}
                                onClick=
                                {() => { this.setState({register: 'Tabs2'}) } }>
                                < a 
                                className = "Tabs" > < Image is = "16x16"
                                src = "https://image.flaticon.com/icons/svg/149/149071.svg" />
                                    <span>Login</span>
                                </a>
                            </li>

                        </ul >
                    </Tabs>
                {this.state.register === 'Tabs1' && <div>
                        <h1 className="label">
                            Please Sign Up Before the record data</h1>
                        <form onSubmit={this.signup}>
                            <div className="field">
                                <label className="label">Name :
                                </label>
                                <div className="Input-Box">
                                    <Input
                                        info
                                        className="input"
                                        type="text"
                                        placeholder="Name"
                                        ref={this.state.name}
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
                                        info
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
                                        info
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
                                What is your role in this project ? "Please select your role" </h1>
                            <Field grouped>
                                <Control >
                                <div className="select is-rounded" >
                                    <select name="position" onChange={this.handleChange.bind(this)} >
                                        <option>Select your role</option>
                                        <option>Advicer(Dr. Knoot)</option>
                                        <option>Dentist(student)</option>
                                        <option>Co-Advicer(Dr. Artith)</option>
                                        <option>Research</option>
                                    </select>
                                </div>
                                </Control>
                              
                            </Field>
              

                        <h1 className={this.state.position === 'Select your role' && 'Error'}>Selected : {this.state.position}
                            
                            </h1>
                            <div className="field is-grouped">
                                <div className="control">
                                    < Button success className = "button is-link"
                                      style = {
                                        {
                                            margin: 2,
                                            borderRadius: 20,
                                            width: 300,

                                        }
                                    }
                                >Submit</Button>

                                </div>

                            </div>
                        </form>

                    </div>
}         
                    {this.state.register === 'Tabs2' && <div>
                        <h1 className="label">Please Login Before the record data</h1>
                        <form onSubmit={this.login}>
                            <div className="field">
                                <label className="label">Email :
                                </label>
                                <div className="Input-Box">
                                    <Input
                                        info
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
                                        info
                                        className="input"
                                        type="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        name="password"
                                        id="InputPassword"
                                        onChange={this.handleChange}/>
                                </div>
                            </div>
                            <Level>
                            <div className="field is-grouped">
                                <div className="control">
                                    <Button success className = "button is-link"
                                    style = {
                                        {
                                            margin: 2,
                                            borderRadius: 20,
                                            width: 300,
                                            

                                        }
                                    }
                                    type = "submit"
                                    > Login </Button>
                                </div>
                            </div>
                            </Level>
                        </form>
                    </div>
}

            </div>
        );
    }
}
export default withRouter(Login);