import React, {Component} from "react";
import LoadingScreen from 'react-loading-screen';
class Loading extends Component {
    render() {
        return (

            <div>
                <LoadingScreen
                    loading={true}
                    bgColor = 'rgba(186, 226, 253, 0.31)'
                    spinnerColor = '#035efc'
                    textColor = 'rgba(55, 226, 253, 0.2)'
                    text=''></LoadingScreen>
            </div>

        );
    }
}
export default Loading;
