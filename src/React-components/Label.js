import React, {Component} from "react";
import CanvasDraw from "./index";
import '../Style/Label.css'
import firebase from '../Firebase';
import Loading from './Loading';
import Swal from 'sweetalert2'
import {

    Tag,
    Image,
    Notification,
    Input,
    Button,
    // Box Control
} from 'reactbulma';
import Level from "reactbulma/lib/components/Level/Level";

class Label extends Component {
    constructor(props) {
        super(props);
    this.state = {
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
        label_images:''
    };
}
    componentDidMount() {

        this.getImage();
        this.setState({
            label_images: this.props.img_src
        })
    

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
    save_data() {
        Swal.fire('Good job!', 'Saved label data Success', 'success')
    }

    render() {

        const {loading, messag_error, messag_success} = this.state;
        if (loading) {
            return <Loading/>;
        }
        
            console.log(this.props.tittle)
       
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
                   
                <Level>
                    <Level.Item>

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
                    </Level.Item>
                </Level>
                <Level>

                    <Level.Item>

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

                    </Level.Item>

                </Level>
                <Level>
                    <Level.Item>
                        <div className="canvas">
                            <CanvasDraw
                                ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                                brushColor={this.state.color}
                                brushRadius={this.state.brushRadius}
                                lazyRadius={this.state.lazyRadius}
                                canvasWidth={this.state.width}
                                canvasHeight={this.state.height}
                                hideGrid
                                ={this.state.hideGrid}
                                imgSrc={this.state.label_images}/>

                        </div>

                    </Level.Item>
                </Level>
                <Level>
                    <Level.Item>
                        <Button
                            success
                            onClick={() => {
                            localStorage.setItem("savedDrawing", this.saveableCanvas.getSaveData());
                            setTimeout(this.save_data, 500);
                        }}>SaveLabled</Button>
                    </Level.Item>
                </Level>
              
            </div>
        );
    }
}
export default Label;