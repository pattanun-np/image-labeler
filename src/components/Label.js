import React, {Component} from "react";
import CanvasDraw from "./index";
import './Label.css';
import firebase from '../firebase';
import Loading from './Loading';
// import Swal from 'sweetalert2'
import {
    // Button,
    Tag,
    // Image,
    Notification,
    Input,
    // Box
    // Control
} from 'reactbulma';
class Label extends Component {
    state = {
        color: "#f44336",
        width: 480,
        height: 480,
        brushRadius: 5,
        messag_success: null,
        messag_error: null,
        lazyRadius: 2,
        mode: 'add',
        open: false,
        hideGrid: 'hideGrid',
        label_images: "https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/Use" +
                "rData%2FijMSNUwudhaibN9iPK8HfDLBqhv1%2FCBCT.png?alt=media&token=5d622c5e-cd7b-4d" +
                "0d-baf4-242a199e79ec"
    };

    componentDidMount() {

        this.getImage();

    }
    handleChangeComplete = (color) => {
        this.setState({color: color.hex});
    };
    onChange1(event) {
        this.setState({brushRadius: event.target.value});
    }
    onChange2(event) {
        this.setState({lazyRadius: event.target.value});
    }
    getImage() {
        const user = firebase
            .auth()
            .currentUser
            .uid;
        const storageRef = firebase
            .storage()
            .ref(`UserData/${user}`);
        storageRef
            .getDownloadURL()
            .then(function (url) {

                this.setState({picture: url})
            })

    };

    render() {
        // var settings = {     dots: true,     infinite: true,     speed: 500,
        // slidesToShow: 1,     slidesToScroll: 1 };

        const {loading, messag_error, messag_success} = this.state;
        if (loading) {
            return <Loading/>;
        }
        return (

            <div className="columm">
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
                <h1 className="label">
                    Label draw segmentation</h1>
          

                <div className="canvas">
                   
               

                        <div className="tools-brush">
                            <label>Brush-Radius:<Tag danger>{this.state.brushRadius}</Tag>
                            </label>
                            <Input
                                type="number"
                                placeholder="BrushRadius | Size 1-25 px"
                                min="1"
                                max="25"
                                value={this.state.brushRadius}
                                onChange={this
                                .onChange1
                                .bind(this)}></Input>

                            <label>Lazy-Radius:<Tag danger>{this.state.lazyRadius}</Tag>
                            </label>
                            <Input
                                type="number"
                                placeholder="LazyRadius | Size 1-25 px"
                                min="1"
                                max="25"
                                value={this.state.lazyRadius}
                                onChange={this
                                .onChange2
                                .bind(this)}></Input>

                        </div>
                                <div className="canvas">
                        <CanvasDraw
                            ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                            brushColor={this.state.color}
                            brushRadius={this.state.brushRadius}
                            saveData={localStorage.getItem("savedDrawing")}
                            lazyRadius={this.state.lazyRadius}
                            canvasWidth={this.state.width}
                            canvasHeight={this.state.height}
                            hideGrid
                            ={this.state.hideGrid}
                            imgSrc={this.state.label_images}/>

                    </div>
                    
                  

                </div>

            </div>
        );
    }
}
export default Label;