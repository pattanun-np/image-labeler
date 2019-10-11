import React, {Component} from 'react';
import Swal from 'sweetalert2'
import './single-page.css'

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
    Notification,
    Progress
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
            images: []
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
            .ref('/UserData/files' + user + 'DownloadURL')


        databaseRef.on('value', (snapshot) => {
            img = snapshot.val()
            this.setState({images: img});
        });

    }
    componentWillMount() {

        this.getData_Counts();
        this.getLabel_Counts();

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

            let percentage = (snapshort.bytesTransferred % snapshort.totalBytes) * 100;
            percentage = percentage.toFixed(2);
            //Process
            this.setState({uploadValue: percentage})
        }, (error) => {
            //Error
            this.setState({messag_error: `Upload error : ${error.message}`})
            setTimeout(() => this.setState({messag_error: null}), 2000);
        }, () => {
        
            Swal
                .fire('Upload Done', 'success', 'success')
                .then((result) => {
                    if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
            setTimeout(() => this.setState({messag_success: null}), 2000);
            storageRef
                .getDownloadURL()
                .then((url) => {

                    this.setState({picture: url})
                })
        
            //Get metadata
            storageRef
                .getMetadata()
                .then((metadata,) => {
                    const databaseRef = firebase
                        .database()
                        .ref('/UserData')
                        .child('files/' + user)
                    

                    let metadataFile = {
                        name: metadata.name,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        fullPath: metadata.fullPath,
                        downloadURL: this.state.picture
                 

                    }

                    //Process save metadata

                    databaseRef.push({metadataFile});

                })
                .catch((error) => {
                    this.setState({messag_error: `Upload error : ${error.message}`})
                    setTimeout(() => this.setState({messag_error: null}), 2000);
                });
        })
    }

    getData_Counts = () => {
        const data_ref = DB.ref('UserData/files/Data_Counts')
        data_ref.on('value', (snapshot) => {
            var counts_data = snapshot.val();
            this.setState({Data: counts_data});

        });
    }
    getLabel_Counts = () => {
        const labled_ref = DB.ref('Labeled_Images/Label_Counts')
        labled_ref.on('value', (snapshot) => {
            var counts_labeled = snapshot.val();
            this.setState({Labeled: counts_labeled});

        });
    }

    render() {

        const {
            loading,
            Labeled,
            Data,
            messag_error,
            messag_success,
    
        
        } = this.state;
        let percentage = Labeled / Data * 100
        percentage = percentage.toFixed(2);
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
                                Datasets Collector & Labeler Tool Version 
                            </Title>
                                  < SubTitle >
                                      Version: (0.7.9 BETA) 
                                      </SubTitle>
                            <SubTitle>
                                For collect & label data
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
                            <h1 className="label">
                                Completed: {percentage}%
                            </h1>
                            <Progress success value={this.state.Labeled} max={this.state.Data}></Progress>
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
                                < a  className="Tabs">
                                    <Image is="16x16" src="https://image.flaticon.com/icons/svg/685/685686.svg"/>
                                    <span>Upload Image</span>
                                </a>
                            </li>

                            <li
                                className={this.state.activeTab === 'Tab3' && 'is-active'}
                                onClick={() => {
                                this.setState({activeTab: 'Tab3'})
                            }}>
                                < a  className="Tabs">
                                    <Image is="16x16" src="https://image.flaticon.com/icons/svg/1158/1158164.svg"/>
                                    <span>Labeling Tool</span>
                                </a>
                            </li>
                            <li
                                className={this.state.activeTab === 'Tab4' && 'is-active'}
                                onClick={() => {
                                this.setState({activeTab: 'Tab4'})
                            }}>
                                < a className="Tabs">
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
                            }}>

                                {this
                                    .state
                                    .files
                                    .map(file => (<File key={file} source={file}/>))}

                            </FilePond>

                        </div>
                    </div>
}
                    {this.state.activeTab === 'Tab3' && <div>

                        <Label/>

                        {/* < Gallery images={image}/>, */},
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