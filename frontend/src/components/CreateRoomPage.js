import React, { Component, useState } from 'react';
import { Button, Grid, Typography, TextField, FormHelperText,
FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
// import {withRouter} from "./withRouter"; instead just imported Navigate in line above

function CreateRoomPage(props) { // the props are only used when the host is attempting to update the Room (they press the Settings button)
    const defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    };
    //const defaultVotes = 2;
    const title = props.update ? "Update Room" : "Create a Room"; // we get this value when we render the host presses Settings button in their Room
    let navigate = useNavigate();
    
    // Whenever the user makes a change in the "/create" room page,
    // this is where we will update the state. Once the Create Room
    // button is pressed, we send this state's data to the back end.
    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    };
    const handleGuestCanPause = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    };
    function handleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            })
        };
        // send a request with requestOptions to the backend
        // once we get a response, we then convert it to .json()
        // then, we take the data (response.json()) and redirect
        // user to the /room page with the respective code
        // Side note: make sure this is no slash after the fetch url!!!
        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => navigate("/room/"+data.code))
            .catch((error) => console.log(error));
    };
    function renderCreateButtons() {
        // all jsx expressions must have a parent component so inclduing the 
        // outer Grid tag
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={() => {handleRoomButtonPressed()}}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    };
    function renderUpdateButtons(){
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={() => {handleRoomButtonPressed()}}>
                    Update Room
                </Button>
            </Grid>
        );
    };
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue='true' onChange={handleGuestCanPause}>
                        <FormControlLabel 
                        value="true" 
                        control={<Radio color="primary"/>}
                        label="Play/Pause"
                        labelPlacement='bottom'
                        />
                        <FormControlLabel 
                        value="false" 
                        control={<Radio color="secondary"/>}
                        label="No Control"
                        labelPlacement='bottom'
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                    required={true} 
                    type="number"
                    onChange={handleVotesChange}
                    defaultValue={votesToSkip}
                    inputProps={{min: 1, style: {textAlign: "center"}, }}
                    />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {/* <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={() => {handleRoomButtonPressed()}}>
                    Create a Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid> */}
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>);
}
export default CreateRoomPage;