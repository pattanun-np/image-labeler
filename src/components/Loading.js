import React, {Component} from "react";
import LoadingScreen from 'react-loading-screen';
class Loading extends Component {
    render() {
        return (

            <div>
                <LoadingScreen
                    loading={true}
                    bgColor='#ffffff'
                    spinnerColor='#42f4c5'
                    textColor='#42f4c5'
                    text='Loading.....'></LoadingScreen>
            </div>

        );
    }
}
export default Loading;
