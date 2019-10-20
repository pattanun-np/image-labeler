import React, {Component} from 'react';
import {
    Title,
    Container,
    Hero,
    SubTitle,
    Card,
    Level
} from 'reactbulma'
import Login from '../components/Login';
import '../Style/Home.css'
import ReactPlayer from 'react-player'
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
                                Version: (0.8.2 BETA)
                            </SubTitle>
                            <SubTitle>
                                For collect & label data for root canal detect with deep nerual networks.
                            </SubTitle>
                        </Container>
                    </Hero.Body>
                </Hero>
                <SubTitle style={{
                    color: 'red'
                }}>**This
                    web application designed for 7 inch or lange screen, we reccommened to use on
                    Ipad or tablet.**</SubTitle>
                <Level>
                    <Level.Item>
                        <Card>
                            <h1 className="label">Tutorial Video:</h1>
                            <ReactPlayer
                                url='https://youtu.be/MVHouwIGDmE'
                                width='100%'
                                height='100%'
                                controlsplaying
                                controls/>
                        </Card>
                    </Level.Item>
                </Level>
                <Level>

                    <Level.Item>
                        <Card
                            className="login"
                            style={{
                            margin: 10,
                            padding: 20,
                            borderRadius: 20,
                            width: 640,
                            heigh: 480
                        }}>
                            < Login/>
                        </Card>

                    </Level.Item>
                </Level>

            </div>
        );
    }
}
export default Home;