import React, {Component} from 'react';
import './single-page.css'
import StorageDataTable from './StorageDataTable';
import Loading from './Loading';
import _ from 'lodash';
import {FilePond, File, registerPlugin} from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// FilePond Register plugin
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import {
    Button,
    Card,
    Level,
    Heading,
    Title,
    Container,
    Hero,
    SubTitle,
    Progress,
    Tabs,
    Image,
    Tag,
    Control
} from 'reactbulma';
import firebase from '../firebase';
import Field from 'reactbulma/lib/components/Field/Field';
var DB = firebase.database();
var storage = firebase.storage();
registerPlugin(FilePondImagePreview);
class Page extends Component {
    constructor(props) {
        super(props);
        this.logout = this
            .logout
            .bind(this);

        this.state = {
            name: "Loading ...",
            uid: '',
            email: "Loading ...",
            position: "Loading ...",
            massage: '',
            Data: 110,
            Types: 8,
            Labeled: 20,
            activeTab: 'Tab1',
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            uploadValue: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            rows: []
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
    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        const user = firebase
            .auth()
            .currentUser
            .uid;
        // handle file upload here
        console.log(" handle file upload here");
        console.log(file);
        const fileUpload = file;
        const storageRef = firebase
            .storage()
            .ref(`UserData/${user}/${file.name}`);
        const task = storageRef.put(fileUpload)
        task.on(`state_changed`, (snapshort) => {
            console.log(snapshort.bytesTransferred, snapshort.totalBytes)
            let percentage = (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
            //Process
            this.setState({uploadValue: percentage})
        }, (error) => {
            //Error
            this.setState({messag: `Upload error : ${error.message}`})
        }, () => {
            //Success
            this.setState({
                messag: `Upload Success`, picture: task.snapshot.downloadURL //เผื่อนำไปใช้ต่อในการแสดงรูปที่ Upload ไป
            })
        })
    }
    handleInit() {
        // handle init file upload here
        console.log('now initialised', this.pond);
    }
    render() {

        const {
            loading,
            name,
            position,
            Labeled,
            Data,
            rows,
            filesMetadata
        } = this.state;

        if (loading) {
            return <Loading/>;
        }
        return (
            <div medium className="contrainer">
                <Hero primary className="hero-head">
                    <Hero.Body>

                        <Title is='5'>Welcome
                            <span>
                                :
                            </span>
                            <Tag medium warning>{name}</Tag>

                        </Title>
                        <Title is='5'>Login as
                            <span>
                                :
                            </span>

                            <Tag medium info>{position}</Tag>

                        </Title>
                        <Button danger onClick={this.logout}>Logout</Button>
                        <Container>
                            <Title>
                                Datasets Collector & Labeler Tool.
                            </Title>

                            <SubTitle>
                                For collect & label data for root canal detect with deep nerual networks.
                            </SubTitle>
                            <Level>
                                <Level.Item hasTextCentered>
                                    <div>
                                        <Heading className="label">Sum of Data</Heading>
                                        <Title>{this.state.Data}</Title>
                                    </div>
                                </Level.Item>
                                <Level.Item hasTextCentered>
                                    <div>
                                        <Heading className="label">Sum of Types</Heading>
                                        <Title>{this.state.Types}</Title>
                                    </div>
                                </Level.Item>
                                <Level.Item hasTextCentered>
                                    <div>
                                        <Heading className="label">Sum of Labled Data</Heading>
                                        <Title>{this.state.Labeled}</Title>
                                    </div>
                                </Level.Item>
                            </Level>
                            <h3>Projects process calculate from target sample dataset:
                            </h3>
                            <Progress medium danger value={Labeled} max={Data}></Progress>

                        </Container>
                    </Hero.Body>
                </Hero >
                < Card className="Upload-Image">
                    <Tabs centered boxed>
                        <ul>
                            <li
                                className={this.state.activeTab === 'Tab1' && 'is-active'}
                                onClick={() => {
                                this.setState({activeTab: 'Tab1'})
                            }}>
                                <a className="Tabs">
                                    <Image is="16x16" src="https://image.flaticon.com/icons/svg/685/685686.svg"/>
                                    <span>Upload Image</span>
                                </a>
                            </li>
                            <li
                                className={this.state.activeTab === 'Tab2' && 'is-active'}
                                onClick={() => {
                                this.setState({activeTab: 'Tab2'})
                            }}>
                                <a className="Tabs">
                                    <Image is="16x16" src="https://image.flaticon.com/icons/svg/138/138747.svg"/>
                                    <span>Label Image</span>
                                </a>
                            </li>
                        </ul>
                    </Tabs>
                    {this.state.activeTab === 'Tab1' && <div>
                        <h1>Upload image</h1>
                        <div className="Margin-25">

                            {/* Pass FilePond properties as attributes */}
                            <FilePond
                                allowMultiple={true}
                                maxFiles={100}
                                ref=
                                {ref => this.pond = ref}
                                server={{
                                process: this
                                    .handleProcessing
                                    .bind(this)
                            }}
                                oninit={() => this.handleInit()}>

                                {/* Set current files using the <File/> component */}
                                {this
                                    .state
                                    .files
                                    .map(file => (<File key={file} source={file}/>))}

                            </FilePond>

                        </div>

                    </div>
}
                    {this.state.activeTab === 'Tab2' && <div>
                        <h1>Edit & Label</h1>
                        {this.state.files.map(file => (
                          <File key={file} source={file} />
                      ))}

                    </div>
}
                </Card>

                <p>
                    Copyright © 2019
                </p>
            </div>
        );
    }
}
export default Page;