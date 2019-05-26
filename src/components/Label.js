import React, {Component} from "react";
import {CirclePicker} from 'react-color';
import CanvasDraw from "./index";
import classNames from "./index.css";
import firebase from '../firebase';
import {
    Button, Tag, Image
    // Control
} from 'reactbulma';
class Label extends Component {
    state = {
        color: "#f44336",
        width: 640,
        height: 640,
        brushRadius: 5,
        lazyRadius: 2,
        label_images: "https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/Use" +
                "rData%2FijMSNUwudhaibN9iPK8HfDLBqhv1%2FCBCT.png?alt=media&token=5d622c5e-cd7b-4d" +
                "0d-baf4-242a199e79ec"
    };
    componentDidMount() {
        console.log("fetching data ...");
        this.getImage();
        console.log("done");
    }
    handleChangeComplete = (color) => {
        this.setState({color: color.hex});
    };
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
                }
            });
    };
    render() {
        return (
            <div>
                <div>
                    <CirclePicker
                        color={this.state.background}
                        onChangeComplete={this.handleChangeComplete}/>

                </div>
                <div className={classNames.tools}>
                    <Button
                        white
                        onClick={() => {
                        localStorage.setItem("savedDrawing", this.saveableCanvas.getSaveData());
                    }}>
                        <Image is="16x16" src="https://image.flaticon.com/icons/svg/148/148730.svg"/>
                        <span></span>Save
                    </Button>
                    <Button
                        white
                        onClick={() => {
                        this
                            .saveableCanvas
                            .clear();
                    }}>
                        <Image is="16x16" src="https://image.flaticon.com/icons/svg/1632/1632714.svg"/>
                        <span></span>Clear
                    </Button>
                    <Button
                        white
                        onClick={() => {
                        this
                            .saveableCanvas
                            .undo();
                    }}>
                        <Image is="16x16" src="https://image.flaticon.com/icons/svg/1828/1828144.svg"/>
                        Undo
                    </Button>
                    <Button
                        white
                        onClick={() => this.setState({
                        label_images: "https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/Use" +
                                "rData%2FijMSNUwudhaibN9iPK8HfDLBqhv1%2F00000001_001.png?alt=media&token=00e8e90d" +
                                "-aa46-4aa7-a15b-a6fad3fa6641"
                    })}>
                        <Image is="16x16" src="https://image.flaticon.com/icons/svg/1665/1665736.svg"/>Load</Button>

                    <div>
                        <label>Brush-Radius:<Tag white>{this.state.brushRadius}</Tag>
                        </label>
                        <Button
                            info
                            value={this.state.brushRadius}
                            onClick={() => this.setState({
                            brushRadius: this.state.brushRadius + 1
                        })}>+</Button>
                        <Button
                            danger
                            value={this.state.brushRadius}
                            onClick={() => this.setState({
                            brushRadius: this.state.brushRadius - 1
                        })}>-</Button>
                    </div>
                    <div>

                        <label>Lazy-Radius:<Tag white>{this.state.lazyRadius}</Tag>
                        </label>
                        <Button
                            info
                            value={this.state.lazyRadius}
                            onClick={() => this.setState({
                            lazyRadius: this.state.lazyRadius + 1
                        })}>+</Button>
                        <Button
                            danger
                            value={this.state.lazyRadius}
                            onClick={() => this.setState({
                            lazyRadius: this.state.lazyRadius - 1
                        })}>-</Button>

                    </div>
                    <div>
                        <Button success>Add Label</Button>
                        <Button danger>Delete Label</Button>
                    </div>

                </div>
                <CanvasDraw
                    ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                    brushColor={this.state.color}
                    brushRadius={this.state.brushRadius}
                    saveData={localStorage.getItem("savedDrawing")}
                    lazyRadius={this.state.lazyRadius}
                    canvasWidth={this.state.width}
                    canvasHeight={this.state.height}
                    imgSrc={this.state.label_images}/>

                <h1>
                    {this.state.label_images}</h1>
            </div>
        );
    }
}
export default Label;