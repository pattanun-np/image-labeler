import React, {Component} from 'react';
import Swal from 'sweetalert2'
import '../Style/single-page.css'
import Loading from '../components/Loading';
import {FilePond, File, registerPlugin} from 'react-filepond';
import Label from '../components/Label';
import Navbar from '../components/Navbar'
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import Modal from 'react-responsive-modal';
import {
    Card,
    Level,
    Heading,
    Title,
    Notification,
    Progress,
    SubTitle,
    Hero,
    Container,
    Tag,
    Media,
    Image
} from 'reactbulma';
import firebase from '../firebase';
import ReactPlayer from 'react-player'
var db = firebase.firestore();
registerPlugin(FilePondImagePreview);
registerPlugin(FilePondPluginImageCrop);
registerPlugin(FilePondPluginFileValidateType);
registerPlugin(FilePondPluginImageEdit);

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
            NData: 0,
            NLabeled: 0,
            files: [], //ใช้เก็บข้อมูล File ที่ Upload
            uploadValue: 0, //ใช้เพื่อดู Process การ Upload
            filesMetadata: [], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
            images: [],
            Datasets: [],
            info: [],
            labelStatus: 'No Labled',
            open: false,
            img: '',
            Id: '',
            Load_fetching: false
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
        const userId = firebase
            .auth()
            .currentUser
            .uid;
        const databaseRef = firebase
            .database()
            .ref('/UserData/files' + userId + 'DownloadURL')

        databaseRef.on('value', (snapshot) => {
            img = snapshot.val()
            this.setState({images: img});
        });
        this.request_Data();

    }
    getUserData = () => {
        const userId = firebase
            .auth()
            .currentUser
            .uid;
        const userdataRef = db
            .collection('users')
            .doc(userId);

        var getuserdata = userdataRef.get();

        this.setState({name: getuserdata.name, email: getuserdata.email, position: getuserdata.position, uid: getuserdata.uid});

    }
    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        // handle file upload here
        const userId = firebase
            .auth()
            .currentUser
            .uid;
        const fileUpload = file;
        const storageRef = firebase
            .storage()
            .ref(`UserData/${userId}/${file.name}`);
        const task = storageRef.put(fileUpload)
        task.on(`state_changed`, (snapshort) => {
            let percentage = (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
            percentage = percentage.toFixed(2);
            //Process
            this.setState({messag_success: `FIle is now uploading... ${percentage} %`})
        }, (error) => {
            //Error
            this.setState({messag_error: `Upload error : ${error.message}`})
            setTimeout(() => this.setState({messag_error: null}), 5000);
        }, () => {

            Swal
                .fire('Upload Complete', 'Press Ok to continue', 'success')
                .then((result) => {
                    if (

                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.timer) {
                        
                       
                    }
                })
            setTimeout(() => this.setState({messag_success: null}), 5000);
           
            //Get metadata
                storageRef
                    .getDownloadURL()
                    .then((url) => {
                        this.setState({
                            picture: url
                        })
                    })
                    .catch((error) => {
                        this.setState({
                            messag_error: `Upload error : ${error.message}`
                        })
                        setTimeout(() => this.setState({
                            messag_error: null
                        }), 5000);
                    });
                
                 storageRef
                     .getMetadata()
                     .then((metadata, ) => {
                         let databaseRef = db
                             .collection('Files')
                             .doc(userId).collection('Images')
                         let metadataFile = {
                             name: metadata.name,
                             size: metadata.size,
                             contentType: metadata.contentType,
                             fullPath: metadata.fullPath,
                             downloadURL: this.state.picture,
                             Status: 'No Label'
                         }
                         //Process save metadata

                         databaseRef.add({
                             metadataFile
                         });

                     })
                     .catch((error) => {
                         this.setState({
                             messag_error: `Upload error : ${error.message}`
                         })
                         setTimeout(() => this.setState({
                             messag_error: null
                         }), 5000);
                     });
             
            this.request_Data();

        })
    }
    onOpenModal = (e) => {

        this.setState({open: true});

    }
    onCloseModal = () => {
        this.setState({open: false});
    };
    getData_Counts = () => {
        this.setState({ Load_fetching: true })
        const userId = firebase
            .auth()
            .currentUser
            .uid;
        let userdataRef = db
            .collection('Files')
            .doc(userId)
        userdataRef.onSnapshot((docSnapshot) => {
            setTimeout(() => {
                //  console.log(`Received doc snapshot: ${docSnapshot.data().numberOfDocs}`);
                 this.setState({
                     NData: docSnapshot
                         .data()
                         .numberOfDocs,
                     Load_fetching: false

                 })
            },7000)
           
            // ...
        }
        )
    }

    getLabel_Counts = () => {
        this.setState({ Load_fetching: true })
      const userId = firebase
          .auth()
          .currentUser
          .uid;
      let userdataRef = db
          .collection('Lebeled')
          .doc(userId)
        userdataRef.onSnapshot((docSnapshot)=> {
              setTimeout(() => {
                //   console.log(`Received doc snapshot: ${docSnapshot.data().numberOfLabeled}`);
                  this.setState({
                      NLabeled: docSnapshot
                          .data()
                          .numberOfLabeled,
                      Load_fetching: false

                  })
              }, 7000);
           
          // ...
      
        })}
    request_Data = () => {
        this.setState({Load_fetching: true})
        const userId = firebase
            .auth()
            .currentUser
            .uid;
        let all_dataRef = db
            .collection('Files')
            .doc(userId)
            .collection('Images')
        all_dataRef.onSnapshot((snapshot) => {
            
            const newData = snapshot
                .docs
                .map((data) => ({
                    data:data.data().metadataFile
                }))
            this.setState({Datasets: newData})
            if (this.state.Datasets.length>0){
                this.getData_Counts();
                this.getLabel_Counts();
            }
        });

    }
    addDefaultSrc(ev) {
        ev.target.src = 'https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/Err' +
                'orIMG(1).png?alt=media&token=ba0dab40-7125-474a-892e-a5d3da70157e'
    }
    onClickFunction = (e, id) => {
        e.preventDefault();
        this.setState({Id: id})
        this.onOpenModal(e)
    }

    render() {
        const {
            loading,
            messag_error,
            messag_success,
            open,
            NData,
            Datasets,
            Id,
            NLabeled,
            Load_fetching
        } = this.state;
        if (loading) {
            return <Loading/>;
        }
        let fetch_data_count;
        if (Load_fetching) {
            fetch_data_count = <Loading/>
        } else {
            fetch_data_count = <Title >
                {NData}
            </Title>
        }
        let fetch_data_count2;
        if (Load_fetching) {
            fetch_data_count2 = <Loading/>
        } else {
            fetch_data_count2 = <Title >
                {NLabeled}
            </Title>
        }
        let fetch_data_count3;
        if (Load_fetching) {
            fetch_data_count3 = <Loading/>
        } else {
            fetch_data_count3 = <Title >
                {NLabeled}/{NData}
            </Title>
        }
        let img_array;
         if (Load_fetching){
            img_array= <Loading/>
        }
        else {
             img_array= Datasets.map((arr,id) => (
                             <div key={id}>
                                 <Card className="img">
                                     
                                     <Card.Content>
                                         <Media>
                                        
                                        <Tag warning className = "status-line" > {
                                             id+1
                                         } </Tag>
                                    <Tag info className="status-line">Name: {arr&&arr.data.name}</Tag>
                                    {/* <Button danger outlined > Delete </Button> */}
                                         </Media>
                                     </Card.Content>
                                     <Card.Image
                                         src = {
                                             arr && arr.data.downloadURL
                                         }
                                         ratio='4by3'
                                         onError={this.addDefaultSrc}
                                         onClick=
                                         {e => { this.onClickFunction(e,id) }}/>
                                         < Tag large light > < i className = "fas fa-search-plus" > </i> <a href = {
                                             arr && arr.data.downloadURL 
                                         }
                                         target = "_blank"
                                         rel = "noopener noreferrer"> Fullsize Images </a> </Tag >
                                 </Card>
                             </div>
                    ))    
             };
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
                <Hero
                    style={{
                    backgroundColor: '#061b45',
                    color: '#035efc'
                }}>
                    <Hero.Body>
                        <Container >
                            <Title
                                style={{
                                color: '#ffffff'
                            }}>
                                Welcome Labeler
                            </Title>
                            <SubTitle
                                style={{
                                color: '#035efc'
                            }}>
                                Dashboard for Labeler
                            </SubTitle>
                            
                        </Container>
                    </Hero.Body>
                </Hero>
                <Card>
                    <Level>
                        <Level.Item hasTextCentered>
                            <div>

                                <Card className="Card-Data">
                                    <Image
                                        is="64x64"
                                        className="icon"
                                        src=" https://image.flaticon.com/icons/svg/456/456825.svg"/>
                                    <Heading className="Label">DATA:</Heading>
                                    {fetch_data_count}
                                    <Heading className="Label">Images</Heading>

                                </Card>
                            </div>
                        </Level.Item>
                        <Level.Item hasTextCentered>
                            <div>
                                <Card className="Card-Label">
                                    <Image
                                        is="64x64"
                                        className="icon"
                                        src="https://image.flaticon.com/icons/svg/103/103410.svg"/>
                                    <Heading className="Label">LABELED:</Heading>
                                    {fetch_data_count2}
                                    <Heading className="Label">Images</Heading>
                                </Card>
                            </div>
                        </Level.Item>
                        <Level.Item hasTextCentered>
                            <div>
                                <Card className="Card-Work">
                                    <Image
                                        is="64x64"
                                        className="icon"
                                        src="https://image.flaticon.com/icons/svg/1179/1179227.svg"/>
                                    <Heading className="Label">WORK:</Heading>
                                    {fetch_data_count3}
                                    <Heading className="Label">Images</Heading>
                                    <Progress success className="progress-work" value={NLabeled} max={NData}></Progress>
                                </Card>
                            </div>
                        </Level.Item>
                    </Level>
                    <Card
                        style={{
                        margin: '30px',
                        marginBottom: '100px',
                        hight: '1200px'
                    }}>
                        < Card style = {
                                {
                                    margin: '30px',
                                     marginLeft: '550px',
                                    marginBottom: '10px',
                                    width:'250px'
                                     }}>
                            <h1 className="label">Tutorial Video:</h1>
                            <ReactPlayer
                                url='https://youtu.be/MVHouwIGDmE'
                                width='100%'
                                height='100%'
                                controlsplaying
                                controls/>
                        </Card>
                        <SubTitle
                                style={{
                                color: '#035efc',
                                marginLeft:'550px'
                                
                            }
                            } > <p style = {
                                    {
                                        color: 'red'

                                    }}> 3 Step to label data
                            <li> 1. Click on image </li>
                           <li > 2. label the root canal and full fill in </li>
                           <li> 3. Press save and repert utill done </li> </p>
                                 <i className = "fas fa-envelope" > </i>
                               <a href = "mailto:phattanun19@hotmail.com?Subject=Hello%20Admin I have some question">Have any question? click here!</a> 
                            </SubTitle>
                        <FilePond
                            className="Upload"
                            allowMultiple={true}
                            files={this.state.files}
                            allowImageCrop={true}
                            maxFiles={100}
                            ref=
                            {ref => this.pond = ref}
                            labelIdle={'Drag and Drop your images that you want to label <span><a>Browse File Limit 2 File per rounds</a></span>'}
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
                            {img_array}
                                </Level.Item>
                            </Level>
                        </Card>
                    </Card>
                </Card>
                < Modal open = {
                    open
                }
                onClose = {
                    this.onCloseModal
                }
                center ={true} styles = {
                        {
                    width:'1500px'
                }}>

                    <Label img={Datasets} imgid ={Id}/>
                </Modal>
            </div>
        );
    }
}
export default Page;
