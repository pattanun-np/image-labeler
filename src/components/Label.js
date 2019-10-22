import React, {Component} from "react";
import CanvasDraw from "./index";
import '../Style/Label.css';
import firebase from '../Firebase';
import Loading from './Loading';
import Swal from 'sweetalert2'
import {Button, Tag, Image, Notification, Level} from 'reactbulma';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';

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
            hideGrid: 'hideGrid'
        };
    }
    componentDidMount() {

        this.getImage();

    }

    handleChangeComplete = (color) => {
        this.setState({color: color.hex});
    };
    onSliderChange = brushRadius => {
        this.setState({brushRadius});
    };
    onSliderChange1 = lazyRadius => {
        this.setState({lazyRadius});
    };
    save_data() {
        Swal.fire('Good job!', 'Saved label data Success', 'success')
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
    addDefaultSrc(ev) {
        ev.target.src = 'https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/Err' +
                'orIMG(1).png?alt=media&token=ba0dab40-7125-474a-892e-a5d3da70157e'
    }
    render() {

        const {loading, messag_error, messag_success} = this.state;
        if (loading) {
            return <Loading/>;
        }
        //  console.log(this.props.img)
        let id = this.props.imgid
        //  console.log(id)
        let Canvas = this
            .props
            .img
            .map((arr, i) => (

                <div key={i}>

                    <CanvasDraw
                        ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                        brushColor={this.state.color}
                        brushRadius={this.state.brushRadius}
                        lazyRadius={this.state.lazyRadius}
                        canvasWidth={this.state.width}
                        canvasHeight={this.state.height}
                        hideGrid={this.state.hideGrid}
                        imgSrc={arr.metadataFile.downloadURL}/>

                </div>

            ))
        return (
            <div>
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
                    <Tag success className="label">
                        Draw segmentation label</Tag>

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

                        </Level.Item>
                    </Level>
                    <Level>

                        <Level.Item>

                            <label>Brush-Radius:<Tag danger>{this.state.brushRadius}</Tag>
                            </label>

                            <Slider
                                min={5}
                                max={60}
                                value={this.state.brushRadius}
                                onChange={this.onSliderChange}
                                railStyle={{
                                height: 2
                            }}
                                handleStyle={{
                                height: 28,
                                width: 28,
                                marginLeft: -14,
                                marginTop: -14,
                                backgroundColor: "hsl(348, 100%, 61%)",
                                border: 0
                            }}
                                trackStyle={{
                                background: "none"
                            }}/>

                        </Level.Item>

                    </Level>
                    <Level>
                        <Level.Item>

                            <label>Lazy-Radius:<Tag danger>{this.state.lazyRadius}</Tag>
                            </label>
                            < Slider
                                min={0}
                                max={20}
                                value={this.state.lazyRadius}
                                onChange={this.onSliderChange1}
                                railStyle={{
                                height: 2
                            }}
                                handleStyle={{
                                height: 28,
                                width: 28,
                                marginLeft: -14,
                                marginTop: -14,
                                backgroundColor: "hsl(348, 100%, 61%)",
                                border: 0
                            }}
                                trackStyle={{
                                background: "none"
                            }}/>

                        </Level.Item>
                    </Level>
                    <Level>
                        <Level.Item>

                            <div>

                                <div className="canvas">

                                    {Canvas[id]}
                                </div>

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
            </div>
        );
    }
}
export default Label;
