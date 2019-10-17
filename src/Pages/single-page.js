import React, {Component} from 'react';
import Swal from 'sweetalert2'
import '../Style/single-page.css'
import Loading from '../React-components/Loading';
import {FilePond, File, registerPlugin} from 'react-filepond';
import Label from '../React-components/Label';
import Navbar from '../React-components/Navbar'
import 'filepond/dist/filepond.min.css';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios'
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux'
import ProjectList from '../React-components/ProjectList'
import {
    Card,
    Level,
    Heading,
    Title,
    Notification,
    Progress,
    Image
} from 'reactbulma';
import firebase from '../Firebase';
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
            Dataset: [],
            work: 0,
            open: false,
            url:''
        }
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
        this.request_Data()
    }
    componentWillMount() {

        this.getData_Counts();
        this.getLabel_Counts();

    }

    onOpenModal = () => {
        this.setState({open: true});
    };

    onCloseModal = () => {
        this.setState({open: false});
    };
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
    request_Data = () => {

        const user = firebase
            .auth()
            .currentUser
            .uid;

        axios.get(`https://random-img.herokuapp.com/random-data/${user}`)
        const Img_data = DB.ref('randomed_list/' + user + '/result/0')
        Img_data.on('value', (snapshot) => {
            var Img_data_load = snapshot.val();
            this.setState({work: Img_data_load.length, Dataset: Img_data_load})

        });
    }
    addDefaultSrc(ev) {
        ev.target.src = 'https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/ErrorIMG(1).png?alt=media&token=ba0dab40-7125-474a-892e-a5d3da70157e'
    }
       render() {
   
        const {loading, messag_error, messag_success, open} = this.state;
        if (loading) {
            return <Loading/>;
        }
           //console.log(this.props)
           const {projects} = this.props;
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

                <Card>
                    <Level>
                        <Level.Item hasTextCentered>
                            <div>
                                <Card className="Card-Data">
                                    <Heading className="Label">DATASET:</Heading>
                                    <Title>{this.state.Data}</Title>
                                    <Heading className="Label">Images</Heading>
                                </Card>
                            </div>
                        </Level.Item>
                        <Level.Item hasTextCentered>
                            <div>
                                <Card className="Card-Label">
                                    <Heading className="Label">LABELED:</Heading>
                                    <Title>{this.state.Labeled}/{this.state.Data}</Title>
                                    <Heading className="Label">Images</Heading>
                                    <Progress
                                        success
                                        className="progress-work"
                                        value={this.state.Labeled}
                                        max={this.state.Data}></Progress>
                                </Card>
                            </div>
                        </Level.Item>
                        <Level.Item hasTextCentered>
                            <div>
                                <Card className="Card-Work">
                                    <Heading className="Label">WORK:</Heading>
                                    <Title>{this.state.Labeled}/{this.state.work}</Title>
                                    <Heading className="Label">Images</Heading>

                                    <Progress
                                        success
                                        className="progress-work"
                                        value={this.state.Labeled}
                                        max={this.state.work}></Progress>
                                </Card>
                            </div>
                        </Level.Item>

                    </Level>
                    <Level>
                        <Level.Item>
                            <Card
                                className="container"
                                style={{
                                margin: '30px',
                                marginBottom: '100px'
                            }}>
                                <FilePond
                                    className="Upload"
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
                                <Card className="gallery">

                                    <Level>

                                        <Level.Item hasTextCentered>
                                            {this
                                                .state
                                                .Dataset
                                                .map((arr, i) => (
                                                    
                                                    <div className="image-item">
                                                        <Image
                                                            className="img"
                                                            is='128x128'
                                                            src={arr.metadataFile.downloadURL}
                                                            
                                                            onClick={this.onOpenModal}
                                                           
                                                            onError={this.addDefaultSrc}/>
                                                        
                                                    </div>
                                                    
                                                ))}

                                        </Level.Item>
                                    </Level>

                                </Card>
                            </Card>
                        </Level.Item>
                    </Level>
            <Level>
                <Level.Item>   
                    <ProjectList projects={projects}/>
                   </Level.Item>
            </Level>
                </Card>

                <Level>
                    <Level.Item>
                        <p>
                            Copyright © 2019
                            <div>Icons made by
                                <a href="https://www.freepik.com/" title="Freepik">Freepik</a>
                                from
                                <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                                is licensed by
                                <a
                                    href="http://creativecommons.org/licenses/by/3.0/"
                                    title="Creative Commons BY 3.0">CC 3.0 BY</a>
                            </div>
                        </p>
                    </Level.Item>
                </Level>

                <Modal classNames="modal" open={open} onClose={this.onCloseModal}>
                    
                    <Label/>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) =>{
    return{
        projects:state.project.projects
    }
}
export default connect(mapStateToProps ) (Page);