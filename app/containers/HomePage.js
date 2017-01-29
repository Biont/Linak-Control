// @flow
import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import Paper from "material-ui/Paper";
import {Tabs, Tab} from "material-ui/Tabs";
import SchedulePage from "../containers/SchedulePage";
import {Grid, Row, Col} from "react-flexbox-grid";
import FlatButton from "material-ui/FlatButton";
import Linak from '../../util/linakUtil';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
};

export default class HomePage extends Component {
    render() {
        return (
            <div>
                <AppBar title="Masterlift Control"/>
                <Paper>
                    <Tabs>
                        <Tab label="Your Masterlift">
                            <div>
                                <h2 style={styles.headline}>Your Masterlift</h2>
                                <p>
                                    This is an example tab.
                                </p>
                                <p>
                                    You can put any sort of HTML or react component in here. It even keeps the component state!
                                </p>
                                <FlatButton label="Move to 0" onClick={this.onMoveDown}/>
                                <FlatButton label="Move to 1500"/>
                                <FlatButton label="Move 40 down!!!"/>
                            </div>
                        </Tab>
                        <Tab label="Schedules">
                            <div>
                                <h2 style={styles.headline}>Schedules</h2>
                                <Grid>
                                    <SchedulePage />
                                </Grid>
                            </div>
                        </Tab>
                        <Tab label="Stats">
                            <div>
                                <h2 style={styles.headline}>Stats</h2>
                                <p>
                                    This is a third example tab.
                                </p>
                                <Grid>
                                    <Row>
                                        <Col xs={6} md={3}>Hello, world!</Col>
                                        <Col xs={6} md={3}>Hello, world!</Col>
                                        <Col xs={6} md={3}>Hello, world!</Col>
                                        <Col xs={6} md={3}>Hello, world!</Col>
                                    </Row>
                                </Grid>
                            </div>
                        </Tab>
                    </Tabs>
                </Paper>
            </div>
        );
    }

    onMoveDown() {
        Linak.moveTo(0);
    }
}
