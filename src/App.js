import React, { Component } from 'react';
import {
    Card, CardContent, Divider, Typography
} from 'material-ui';
import withStyles from "material-ui/styles/withStyles";
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';
import TranslateTab from './TranslateTab';
import TransposeTab from './TransposeTab';
import setupFirebase from './API_SETUP';

const TabContainer = ({ children, dir }) => {
    return (
        <div dir={dir}>
            {children}
        </div>
    );
};

class App extends Component {
    constructor(props) {
        super(props);

        setupFirebase();
    }

    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    renderMain() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    centered
                >
                    <Tab label="Transpose" />
                    <Tab label="Translate" />
                </Tabs>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                    slideStyle={{ padding: '0px !important' }}
                >
                    <TabContainer dir={theme.direction}>
                        <TransposeTab />
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <TranslateTab/>
                    </TabContainer>
                </SwipeableViews>
            </div>
        );
    }

    render() {
        return (
            <div style={styles.root}>
                <div>
                    <Card
                        id='appCard'
                        style={{
                            display: 'flex',
                            top: '10%',
                            borderRadius: '20px'
                        }}
                    >
                        <CardContent
                            style={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                type="display1"
                                style={{
                                    paddingBottom: '8px',
                                    letterSpacing: '2px'
                                }}
                            >
                                CHORD 123
                              </Typography>
                            <Divider />

                            {this.renderMain()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

const styles = {
    root: {
        display: 'flex',
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #3498db 50%, #ecf0f1 50%)'
    },
    container: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const matUIStyles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minWidth: '340px',
        maxWidth: '340px'
    },
});

export default withStyles(matUIStyles, { withTheme: true })(App);
