import React, {Component} from "react";
import LoadingScreen from 'react-loading-screen';
class Loading extends Component {
    render() {
        return (

            <div>
                <LoadingScreen
                    loading={true}
                    bgColor = '#061b45'
                    spinnerColor = '#035efc'
                    textColor = '#035efc'
                    text='Loading Data...'></LoadingScreen>
            </div>

        );
    }
}
export default Loading;
