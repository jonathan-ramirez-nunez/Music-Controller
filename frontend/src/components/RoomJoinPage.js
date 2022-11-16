import React, { Component, useState } from "react";
import { Button, Grid, Typography, TextField } from '@mui/material';
import { Link, Navigate, useNavigate } from "react-router-dom";

// User-funcitonal needs of RoomJoinPage:
// - text field for user to search for room with a room code
// - one button to join room
// - second button to go back to previous page

function RoomJoinPage () {
    let navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
    };
    function handleRoomButtonPressed() {
        // send POST request to attempt to join room.
        // does room exist, if so, can we join
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: roomCode
            })
        };
        // make sure this is no slash after the fetch url!!!
        fetch('/api/join-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    // we will redirect user to the correct room page (/room/roomCode)
                    // "we can get this code from the frontend instead of the server
                    // bc we know the code is valid" <- probably want to do the frontend
                    // bc its easier?...
                    navigate("/room/"+roomCode);
                    //this.props.history.push(`/room/${this.state.roomCode}`)
                }
                else {
                    setError("Room not found.");
                }
            }).catch((error) => { // just incase fetch (sending the request) failed
                console.log(error);
            });
    };
    return (
        <Grid containter spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={handleRoomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );  
}
export default RoomJoinPage;


/* export default class RoomJoinPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this); 
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }

    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value,
        });
    }
    roomButtonPressed() {
        // send POST request to attempt to join room.
        // does room exist, if so, can we join
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: this.state.roomCode
            })
        };
        fetch('/api/join-room/', requestOptions)
            .then((response) => {
                if (response.ok) {
                    // we will redirect user to the correct room page (/room/roomCode)
                    // "we can get this code from the frontend instead of the server
                    // bc we know the code is valid" <- probably want to do the frontend
                    // bc its easier?...
                    this.props.history.push(`/room/${this.state.roomCode}`)
                }
                else {
                    this.setState({error: "Room not found."})
                }
            }).catch((error) => { // just incase fetch (sending the request) failed
                console.log(error);
            })
    }

    render(){
        return (
            <Grid containter spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        error={this.state.error}
                        label="Code"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={this.roomButtonPressed}>
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }
} */