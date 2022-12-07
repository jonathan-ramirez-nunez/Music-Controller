import React, {useState} from 'react';
import {Link, useParams, useNavigate} from "react-router-dom";
import { Grid, Button, Typography } from '@mui/material';
import CreateRoomPage from './CreateRoomPage';

export default function Room(props){
    // we can access the leaveRoomCallback() passed as a prop from HomePage
    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);
    // For settings button shown to host to access settings page, which is
    // a different version of this Room page.
    const[showSettings, setShowSettings] = useState(false);
    
    const {roomCode} = useParams();
    let navigate = useNavigate();

    // We have to check if we get a valid response so that we aren't accidentally
    // assigning empty/nulls values to our variables, causing our Room page
    // to show empty values. If we get an invalid response then we redirect
    // to the HomePage. 
    fetch('/api/get-room?code='+roomCode)
    .then((response) => {
        if (!response.ok) {
            props.leaveRoomCallback();
            navigate('/');
        }
        return response.json();
    })
    .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host); 
    });

    function leaveButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "applicatiion/json"},
        };
        fetch('/api/leave-room', requestOptions)
        .then((response) => {
            props.leaveRoomCallback();
            navigate('/');
        });
    };
    function renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    function renderSettings() {
        // This function will render a CreateRoomPage and pass our current 
        // Room's props. A 'Close' button will also be rendered to allow the
        // host to close the settings version of the Room page.
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center"></Grid>
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={votesToSkip} 
                        guestCanPause={guestCanPause} 
                        roomCode={roomCode} 
                        //updateCallBack={} call this whenever the room updates
                    />
                <Grid item xs={12} align="center">
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => setShowSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };
    if (showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {String(isHost)}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
    /* return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {String(guestCanPause)}</p>
            <p>Host: {String(isHost)}</p>
        </div>
    ); */
};

/*
import {Component} from 'react';
 export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };
        this.roomCode = this.props.match.params.roomCode;
    }

    render() {
        return (
        <div>
            <h3>{this.roomCode}</h3>
            <p>Votes: {this.state.votesToSkip}</p>
            <p>Guest Can Pause: {this.state.guestCanPause}</p>
            <p>Host: {this.state.isHost}</p>
        </div>
        );
    }
}
 */