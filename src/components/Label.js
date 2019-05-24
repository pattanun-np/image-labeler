import React, {Component} from "react";
import {render} from "react-dom";

import CanvasDraw from "./index";
import classNames from "./index.css";
import {
    Button, Tag, Notification,
    // Control
} from 'reactbulma';
class Label extends Component {
    state = {
        color: "#FFFF99",
        width: 400,
        height: 400,
        brushRadius: 10,
        lazyRadius: 12
    };
    render() {
        return (
            <div>

                <div>

                    <div
                        style={{
                        display: "inline-block",
                        width: "24px",
                        height: "24px",
                        backgroundColor: this.state.color,
                        border: "1px solid #272727"
                    }}/>
                </div>

                <div className={classNames.tools}>
                    <Button
                        success
                        onClick={() => {
                        localStorage.setItem("savedDrawing", this.saveableCanvas.getSaveData());
                    }}>
                        Save
                    </Button>
                    <Button
                        danger
                        onClick={() => {
                        this
                            .saveableCanvas
                            .clear();
                    }}>
                        Clear
                    </Button>
                    <Button
                        warning
                        onClick={() => {
                        this
                            .saveableCanvas
                            .undo();
                    }}>
                        Undo
                    </Button>
                    <Button
                        info
                        onClick={() => {
                        this
                            .loadableCanvas
                            .loadSaveData(localStorage.getItem("savedDrawing"));
                    }}>Load</Button>

                    <div>
                        <label>Brush-Radius:<Tag>{this.state.brushRadius}</Tag>
                        </label>
                        <Button
                            info
                            type="number"
                            value={this.state.brushRadius}
                            onClick={() => this.setState({
                            brushRadius: this.state.brushRadius + 1
                        })}>+</Button>
                        <Button
                            danger
                            type="number"
                            value={this.state.brushRadius}
                            onClick={() => this.setState({
                            brushRadius: this.state.brushRadius - 1
                        })}>-</Button>
                    </div>
                    <div>

                        <label>Lazy-Radius:<Tag>{this.state.lazyRadius}</Tag>
                        </label>
                        <Button
                            info
                            type="number"
                            value={this.state.lazyRadius}
                            onClick={() => this.setState({
                            lazyRadius: this.state.lazyRadius + 1
                        })}>+</Button>
                        <Button
                            danger
                            type="number"
                            value={this.state.lazyRadius}
                            onClick={() => this.setState({
                            lazyRadius: this.state.lazyRadius - 1
                        })}>-</Button>

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
                    imgSrc="https://firebasestorage.googleapis.com/v0/b/deeplearning-7f788.appspot.com/o/UserData%2FijMSNUwudhaibN9iPK8HfDLBqhv1%2F00000001_001.png?alt=media&token=15a37dfb-9c63-4534-bdb3-857a214e84f2"/>

            </div>
        );
    }
}
export default Label;