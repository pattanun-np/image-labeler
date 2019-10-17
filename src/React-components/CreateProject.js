import React, { Component } from 'react';
import {connect} from 'react-redux';
import { createProject} from '../Redux-store/Redux-actions/projectActions'
import {
    Card,
    Level,
    Input,
    Button, Textarea
} from 'reactbulma';

class CreateProject extends Component {


    state = {
            title: '',
            content: '',
    
        }
    
    handleChange=(e)=> {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    handleSubmit = (e)=> {
        e.preventDefault();
        // console.log(this.state)
        this.props.createProject(this.s)
        
    }
    render() {

       
        return (
            <div>
                <Level>
                    <Level.Item>
                        <Card style={{
                            marginTop: '50px',
                            padding:'10px'
                        }}>
                            <form onSubmit={this.handleSubmit}>


                                <div className="field">
                                    <label className="label">Title :
                                </label>
                                    <div className="Input-Box">
                                        <Input
                                            primary
                                            className="input"
                                            type="text"
                                            placeholder="Title:"
                                            id="title"
                                            onChange={this.handleChange} />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Content: :
                                </label>
                                    <div className="control">
                                        <Textarea
                                            primary
                                            className="input"
                                            type="text"
                                            placeholder="Content:"
                                           
                                        
                                            id="content"
                                            onChange={this.handleChange} />
                                    </div>
                                </div>
                                <Level>
                                    <Level.Item>
                                        <div className="field is-grouped">
                                            <div className="control">
                                                <Button success className="button is-link"
                                                    style={
                                                        {
                                                            margin: 2,
                                                            borderRadius: 20,
                                                            width: 300,

                                                        }
                                                    }
                                                    type="submit"
                                                >CreateProject </Button>
                                            </div>
                                        </div>
                                    </Level.Item>
                                </Level>
                            </form>

                        </Card>


                    </Level.Item>
                </Level>
            

</div>
        )
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createProject: (project)=> dispatch(createProject(project))
    }
}
export default connect(null, mapDispatchToProps)(CreateProject);