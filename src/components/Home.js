import React, {Component} from 'react';
import {
    Title,
    Container,
    Hero,
    SubTitle,
    Card,
    level
} from 'reactbulma'
import Login from './Login';
import './Home'
import Level from 'reactbulma/lib/components/Level/Level';
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
                <Level>
                    <LevelItem>
                        <Card style={{
                            margin: 10,
                            padding: 20, 
                            borderRadius: 20,
                            width:640,
                            heigh:480
            
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