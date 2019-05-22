import React, {Component} from 'react';
import './single-page.css'
import StorageDataTable from './StorageDataTable';
import Loading from './Loading';
// import _ from 'lodash';
import {FilePond, File, registerPlugin} from 'react-filepond';
import Label from './Label';
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
    // Delete,
    SubTitle,
    Progress,
    Tabs,
    Image,
    Tag,
    Notification,
    // Control
} from 'reactbulma';
import firebase from '../firebase';
var DB = firebase.database();
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
            messag_success: '',
            messag_error: '',
            Data: 0,
            Types: 2,
            Labeled: 0,
            activeTab: 'Tab1',
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            uploadValue: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            rows: [],
            picture: null
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
    componentWillMount() {
        this.getMetaDataFromDatabase();

    }
    getMetaDataFromDatabase() {
        console.log("getMetaDataFromDatabase");
        const user = firebase
            .auth()
            .currentUser
            .uid;
        const databaseRef = firebase
            .database()
            .ref('/UserData')
            .child('files/' + user);

        databaseRef.on('value', (snapshot) => {
            this.setState({
                filesMetadata: snapshot.val()
            }, () => this.addMetadataToList());
        });
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
        // handle file upload here
        console.log(" handle file upload here");
        console.log(file);

        const fileUpload = file;
        const user = firebase
            .auth()
            .currentUser
            .uid;
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
            this.setState({messag_error: `Upload error : ${error.message}`})

            setTimeout(() => this.setState({messag_error: null}), 1000);
        }, () => {
            //Success
            this.setState({
                messag_success: `Upload Success` //เผื่อนำไปใช้ต่อในการแสดงรูปที่ Upload ไป

            });
            setTimeout(() => this.setState({messag_success: null}), 1000);
            storageRef
                .getDownloadURL()
                .then(function (url) {
                    console.log(url)
                    this.setState({picture: url})
                })
                .catch((error) => {
                    switch (error.code) {
                        case 'storage/object-not-found':
                            // File doesn't exist
                            break;

                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect the server response
                            break;

                            console.log(error.message)
                    }
                });
            //Get metadata
            storageRef
                .getMetadata()
                .then((metadata) => {
                    // Metadata now contains the metadata for 'filepond/${file.name}'
                    let metadataFile = {
                        name: metadata.name,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        fullPath: metadata.fullPath
                    }

                    //Process save metadata
                    const databaseRef = firebase
                        .database()
                        .ref('/UserData')
                        .child('files/' + user);
                    databaseRef.push({metadataFile});

                })
                .catch((error) => {
                    this.setState({messag_error: `Upload error : ${error.message}`})
                    setTimeout(() => this.setState({messag_error: null}), 1000);
                });
        })
    }

    handleInit() {
        // handle init file upload here
        console.log('now initialised', this.pond);
    }
    addMetadataToList() {
        let i = 1;
        let rows = [];

        //Loop add data to rows
        for (let key in this.state.filesMetadata) {

            let fileData = this.state.filesMetadata[key];

            let objRows = {
                no: i++,
                key: key, //ใช้เพื่อ Delete
                name: fileData.metadataFile.name,
                fullPath: fileData.metadataFile.fullPath,
                size: (fileData.metadataFile.size),
                contentType: fileData.metadataFile.contentType
            }

            rows.push(objRows)
        }

        this.setState({
            rows: rows
        }, () => {
            console.log('Set Rows')
        });
    }

    deleteMetaDataFromDatabase(e, rowData) {
        const user = firebase
            .auth()
            .currentUser
            .uid;
        const filedataRef = DB
            .ref('/UserData')
            .child('files/' + user);
        const storageRef = firebase
            .storage()
            .ref(`UserData/${user}/${rowData.name}`);

        // Delete the file on storage
        storageRef
            .delete()
            .then(() => {
                console.log("Delete file success");

                // Delete the file on realtime database
                filedataRef
                    .child(rowData.key)
                    .remove()
                    .then(() => {
                        console.log("Delete metada success");
                        console.log(this);
                        this.getMetaDataFromDatabase()
                    })
                    .catch((error) => {
                        console.log("Delete metada error : ", error.message);

                    });

            })
            .catch((error) => {
                console.log("Delete file error : ", error.message);

            });

    }

    render() {

        const {
            loading,
            name,
            position,
            Labeled,
            Data,
            rows,
            // files,
            messag_error,
            messag_success,
            filesMetadata
        } = this.state;

        if (loading) {
            return <Loading/>;
        }
        return (
            <div className="contrainer">
                <div className="messag">{messag_success
                        ? <Notification success>
                                {messag_success}
                            </Notification>
                        : null}</div>
                <div className="messag">{messag_error
                        ? <Notification danger>
                                {messag_error}
                            </Notification>
                        : null}</div>

                <Hero primary className="hero-head">
                    <Hero.Body>

                        <Container>
                            <Title>
                                Datasets Collector & Labeler Tool.
                            </Title>
                            <SubTitle>
                                For collect & label data for root canal detect with deep nerual networks.
                            </SubTitle>
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
                                    <span>List of Image</span>
                                </a>
                            </li>
                            <li
                                className={this.state.activeTab === 'Tab3' && 'is-active'}
                                onClick={() => {
                                this.setState({activeTab: 'Tab3'})
                            }}>
                                <a className="Tabs">
                                    <Image is="16x16" src="https://image.flaticon.com/icons/svg/1158/1158164.svg"/>
                                    <span>Labeling Tool</span>
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
                                files={this.state.files}
                                maxFiles={1000000}
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
                        <StorageDataTable
                            rows={rows}
                            filesMetadata={filesMetadata}
                            deleteData={this.deleteMetaDataFromDatabase}/>

                    </div>
}
                    {this.state.activeTab === 'Tab3' && <div>
                        <h1>
                            Label draw segmentation</h1>
                        <Label/>

                    </div>
}
                </Card>

                <p>
                    Copyright © 2019
                    <div>Icons made by
                        <a href="https://www.freepik.com/" title="Freepik">Freepik</a>
                        from
                        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                        is licensed by
                        <a
                            href="http://creativecommons.org/licenses/by/3.0/"
                            title="Creative Commons BY 3.0"
                            target="_blank">CC 3.0 BY</a>
                    </div>
                </p>
            </div>
        );
    }
}
export default Page;