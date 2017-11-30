import React, { Component } from 'react';
import firebase from 'firebase';
import {
    Button, CircularProgress, FormControl, Input, InputLabel, MenuItem, Select
} from 'material-ui';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Dropzone from 'react-dropzone-component';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';

const URL = 'https://chord123.herokuapp.com/';

class TranslateTab extends Component {
    state = {
        key: 'G',
        title: '',
        response: null,
        downloading: false
    };

    componentDidMount() {
        this.downloader = this.refs.downloader;
    }

    handleChange = event => {
        this.setState({ key: event.target.value });
        if (this.dropzone) {
            this.dropzone.options.params.key = event.target.value;
            this.dropzone.files.forEach(file => {
                file.status = 'queued';
            })
        }
    };

    onAddedFile = file => {
        // get from front till dot
        let title = file.name.substr(0, file.name.indexOf('.'));

        // replace any brackets with keys
        title.replace(/\s+\([A-G][#b]?\)/g, '');
        this.setState({ title });
    };

    onRemovedFile = () => {
        this.setState({ title: '' });
    };

    onSuccess = (file, response) => {
        if (response) {
            const outputTitle = `${this.state.title} (${this.state.key}).docx`;
            const storageRef = firebase.app().storage().ref();
            const ref = storageRef.child(outputTitle);
            ref.putString(response, 'base64')
                .then(snapshot => {
                    this.downloader.href = snapshot.downloadURL;
                    this.downloader.click();
                    this.setState({ downloading: false });
                })
                .catch(e => {
                    console.log(e);
                })
        }
    };

    handleDownload = () => {
        this.setState({ downloading: true });
        this.dropzone.options.params.key = this.state.key;
        this.dropzone.processQueue();
    };

    render() {
        const { classes } = this.props;

        const config = {
            iconFiletypes: ['.docx'],
            showFiletypeIcon: true,
            postUrl: `${URL}/translate`
        };

        const { key } = this.state;

        const djsConfig = {
            acceptedFiles: '.docx',
            addRemoveLinks: true,
            autoProcessQueue: false,
            params: {
                key
            }
        };

        const eventHandlers = {
            init: (dropzone) => this.dropzone = dropzone,
            addedfile: this.onAddedFile,
            removedfile: this.onRemovedFile,
            success: this.onSuccess
        };

        const steps = ['Choose a Key to translate to', 'Upload your .docx file', 'Download the file!'];
        const KEYS = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'];

        return (
            <div id='appCardContent' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <a ref="downloader" style={{display: 'none'}} />
                <Stepper orientation="vertical" style={{ display: 'flex', flex: 1, width: '100%' }} className={classes.root}>
                    <Step active>
                        <StepLabel>{steps[0]}</StepLabel>
                        <StepContent classes={{ transition: classes.transition }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <FormControl className={classes.root} style={{ marginRight: '8px' }}>
                                    <InputLabel htmlFor="key-simple">Key</InputLabel>
                                    <Select
                                        value={this.state.key}
                                        onChange={this.handleChange}
                                        input={<Input id="key-simple" />}
                                        autoWidth
                                    >
                                        {KEYS.map(key => (
                                            <MenuItem key={key} value={key}>{key}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.root} style={{ visibility: 'hidden' }} />
                            </div>
                        </StepContent>
                    </Step>

                    <Step active>
                        <StepLabel>{steps[1]}</StepLabel>
                        <StepContent classes={{ transition: classes.transition }}>
                            <div>
                                <Dropzone
                                    config={config}
                                    djsConfig={djsConfig}
                                    eventHandlers={eventHandlers}
                                />
                            </div>
                        </StepContent>
                    </Step>

                    <Step active >
                        <StepLabel>{steps[2]}</StepLabel>
                        <StepContent classes={{ transition: classes.transition }}>
                            {
                                (
                                    this.state.downloading ?
                                        <CircularProgress /> :
                                        <Button
                                            disabled={this.state.title === ''}
                                            raised
                                            onClick={this.handleDownload}
                                        >
                                            Download
                                        </Button>
                                )
                            }
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
    }
}

const matUIStyle = theme => ({
    root: {
        width: '90%',
        padding: '4px 0',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginTop: theme.spacing.unit,
    },
    resetContainer: {
        marginTop: 0,
        padding: theme.spacing.unit * 3, // TODO: See TODO note on Stepper
    },
    transition: {
        paddingBottom: 4,
    },
});

export default withStyles(matUIStyle)(TranslateTab);
