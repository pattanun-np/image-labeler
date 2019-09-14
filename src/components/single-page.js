import React, {Component} from 'react';
import './single-page.css'
import StorageDataTable from './StorageDataTable';
import Loading from './Loading';
import {FilePond, File, registerPlugin} from 'react-filepond';
import Label from './Label';
import Navbar from './Navbar'
import 'filepond/dist/filepond.min.css';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import {
    Card,
    Level,
    Heading,
    Title,
    Container,
    Hero,
    SubTitle,
    Tabs,
    Image,
    Notification
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
            activeTab: 'Tab3',
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            uploadValue: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            images: [],
            rows: [],
            picture: ''
        };
    }
    logout() {
        firebase
            .auth()
            .signOut();
    };
    componentDidMount() {
        let img = []
        this.getUserData();
        const user = firebase
            .auth()
            .currentUser
            .uid;
        const databaseRef = firebase
            .database()
            .ref('/UserData/files'+user+'DownloadURL')
            // .child('link_url/')

        databaseRef.on('value', (snapshot) => {
            img = snapshot.val()
            this.setState({images: img});
            console.log(this.state.images)
        });

    }
    componentWillMount() {
        this.getMetaDataFromDatabase();
        //this.getDownloadFromDatabase();

    }
    getMetaDataFromDatabase() {

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

            let percentage = (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
            percentage = percentage.toFixed(2);
            //Process
            this.setState({uploadValue: percentage, messag_success: `Uploading:${this.state.uploadValue}%`})
        }, (error) => {
            //Error
            this.setState({messag_error: `Upload error : ${error.message}`})
            setTimeout(() => this.setState({messag_error: null}), 2000);
        }, () => {
            //Success
            this.setState({messag_success: `Upload Success`});
            setTimeout(() => this.setState({messag_success: null}), 2000);
            storageRef
                .getDownloadURL()
                .then((url) => {

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

                    }
                });
            //Get metadata
            storageRef
                .getMetadata()
                .then((metadata) => {
                    const databaseRef = firebase
                        .database()
                        .ref('/UserData')
                        .child('files/' + user)
                    const url = this.state.picture

                    let metadataFile = {
                        name: metadata.name,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        fullPath: metadata.fullPath,
                        // customMetadata: {     'DownloadLink': url,   }

                    }

                    //Process save metadata

                    databaseRef.push({metadataFile, link_url: url});

                })
                .catch((error) => {
                    this.setState({messag_error: `Upload error : ${error.message}`})
                    setTimeout(() => this.setState({messag_error: null}), 2000);
                });
        })
    }

    handleInit() {
        // handle init file upload here

    }
    addMetadataToList() {
        let i = 1;
        let rows = [];

        for (let key in this.state.filesMetadata) {
            let fileData = this.state.filesMetadata[key];

            let objRows = {
                no: i++,
                key: key,
                name: fileData.metadataFile.name,
                fullPath: fileData.metadataFile.fullPath,
                size: fileData.metadataFile.size,
                contentType: fileData.metadataFile.contentType
            }

            rows.push(objRows)

        }

        this.setState({
            rows: rows
        }, () => {});
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

        storageRef
            .delete()
            .then(() => {

                // Delete the file on realtime database
                filedataRef
                    .child(rowData.key)
                    .remove()
                    .then(() => {

                        this.getMetaDataFromDatabase();

                    })

            })
            .catch((error) => {});

    }

    deleteUrlsFromDatabase(e, urlData) {

        const user = firebase
            .auth()
            .currentUser
            .uid;
        const urldataRef = DB.ref(`UserData/Files/${user}/${urlData.name}`)

        urldataRef
            .child(urlData.key_urls)
            .remove()
            .then(() => {})
            .catch((error) => {});

    }

    render() {

        const {
            loading,
            Labeled,
            Data,
            rows,
            messag_error,
            messag_success,
            filesMetadata,
            images
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
                <Navbar/>
                <Hero info className="hero-head">
                    <Hero.Body>

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
                                        <Title>{this.state.Data}</Title>Images
                                    </div>
                                </Level.Item>

                                <Level.Item hasTextCentered>
                                    <div>
                                        <Heading className="label">Sum of Labled Data</Heading>
                                        <Title>{this.state.Labeled}</Title>
                                        Images
                                    </div>
                                </Level.Item>
                            </Level>

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
                            <li
                                className={this.state.activeTab === 'Tab4' && 'is-active'}
                                onClick={() => {
                                this.setState({activeTab: 'Tab4'})
                            }}>
                                <a className="Tabs">
                                    <Image is="16x16" src="https://image.flaticon.com/icons/svg/1728/1728561.svg"/>
                                    <span>Analysis</span>
                                </a>
                            </li>
                        </ul>
                    </Tabs>
                    {this.state.activeTab === 'Tab1' && <div>
                        <h1>Upload image</h1>
                        <div className="Margin-25">

                            <FilePond
                                allowMultiple={true}
                                files={this.state.files}
                                maxFiles={1000000000}
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
                        <Label/>
                    </div>}
                    {this.state.activeTab === 'Tab4' && <div>
                        <h1>
                            Model</h1>
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