import React, {Component} from 'react';
import {
    Title,
    Container,
    Hero,
    SubTitle,
    Card,
    Level
} from 'reactbulma'
import Login from './Login';
import './Home.css'
import ReactPlayer from 'react-player'
import LevelItem from 'reactbulma/lib/components/Level/LevelItem';
class Home extends Component {
    render() {
        return (
            <div id="contrainer">
                <Hero info className="hero-head">
                    <Hero.Body>
                        <Container>
                            <Title>
                                Welcome to Datasets Collector & Labeler Tool.
                            </Title>
                            < SubTitle >
                                Version: (0.7.9 BETA)
                            </SubTitle>
                            <SubTitle>
                                For collect & label data for root canal detect with deep nerual networks.
                            </SubTitle>
                        </Container>
                    </Hero.Body>
                </Hero>
                <SubTitle style={{
                    color:'red'
                   
                }}>**This web application designed for 7 inch or lange screen, we reccommened to use on Ipad or tablet.**</SubTitle>
                <Level>
                    <LevelItem>
                        <Card>
                            <h1 className="label">Tutorial Video:</h1>
                            <ReactPlayer url='https://youtu.be/8CxlSJVwBZk'
                                width='100%'
                                height='100%'
                                controlsplaying
                                controls
                            playing/>
                        </Card>
                    </LevelItem>
                </Level>
                <Level>

                    <LevelItem>
                        <Card className="login"
                            style={{
                            margin: 10,
                            padding: 20,
                            borderRadius: 20,
                            width: 640,
                            heigh: 480
                        }}>
                            < Login/>
                        </Card>

                    </LevelItem>
                </Level>

            </div>
        );
    }
}
export default Home;