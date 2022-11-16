import React, { Component, useState } from 'react';
import { Button, Grid, Typography, TextField, FormHelperText,
FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
// import {withRouter} from "./withRouter"; instead just imported Navigate in line above

function CreateRoomPage() {
    const defaultVotes = 2;
    let navigate = useNavigate();
    // Whenever the user makes a change in the "/create" room page,
    // this is where we will update the state. Once the Create Room
    // button is pressed, we send this state's data to the back end.
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

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
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create a Room
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
                    defaultValue={defaultVotes}
                    inputProps={{min: 1, style: {textAlign: "center"}, }}
                    />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
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
        </Grid>);
}
export default CreateRoomPage;
//export default withRouter(CreateRoomPage);





/* export default class CreateRoomPage extends Component {
    defaultVotes = 2;

    constructor(props){
        super(props);

        // Whenever the user makes a change in the "/create" room page,
        // this is where we will update the state. Once the Create Room
        // button is pressed, we send this state's data to the back end.
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };

        // we are binding this method to the class https://youtu.be/bQXhG1eZGLM?t=1285
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPause = this.handleGuestCanPause.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);

    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value, // target is the up/down TextField box in "/create"
        });
    }

    handleGuestCanPause(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false, // target is RadioGroup button
        });
    }

    handleRoomButtonPressed(){
        // attributes inside body have to be named exactly as in the views.py
        // inside CreateRoomView
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            }),
        };
        // send a request with requestOptions to the backend
        // once we get a response, we then convert it to .json()
        // then, we take the data (response.json()) and redirect
        // user to the /room page with the respective code
        fetch('/api/create-room', requestOptions).then((response) =>
            response.json()
        ).then((data) => this.props.navigate("/room/"+data.code));
    }

    render(){
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue='true' onChange={this.handleGuestCanPause}>
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
                    onChange={this.handleVotesChange}
                    defaultValue={this.defaultVotes}
                    inputProps={{min: 1, style: {textAlign: "center"}, }}
                    />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                    Create a Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>);
        
        // return <p>This is the create room join page</p>;
    }
}
//export default withRouter(CreateRoomPage); */