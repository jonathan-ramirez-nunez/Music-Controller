import React, { Component, useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {Grid, Button, ButtonGroup, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

const apiUserInRoom = 'api/user-in-room';

function HomePage(props) {
    // In regards to each Route: React's Router will pass some props to our 
    // element e.g. RoomJoinPage, Room, etc. that will have information 
    // relating to how we got to the corresponding landing url page.
    // The prop we are particularly interested in is 'match'. It can tell 
    // us how it mathched the landing url page with the exact string given
    // in the path, e.g. path='/create'
    const [roomCode, setRoomCode] = useState(null);
    //let navigate = useNavigate();

    // useEffect runs (asynchronously?) as soon as the component mounts.
    // this code will run the first time the component mounts and also
    // whenever the roomCode var changes. If you only want this inner code
    // (api request) to run once then remove roomCode from array at the end.

    useEffect(() =>  {
        fetch('api/user-in-room')
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setRoomCode(data.code);
        });
    }, []);

    function renderHomePage() {
        if (roomCode) {
            console.log(roomCode);
            console.log(`/room/${roomCode}`);
            return (<Navigate replace={true} to={`/room/${roomCode}`}/>);
        }
        //navigate(`/room/${roomCode}`);
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    function clearRoomCode() {
        // This function will be used in the Route dedicated to the Room page
        // so that this HomePage forgets about the room code whenever we leave a room.
        setRoomCode(null);
    };

    // passing a function (renderHomePage() for example) 
    // as a property of a component (<Route> with () calls the function.
    // if no parentheses, then the function is called later.
    return ( 
        <Router>
            <Routes>
                <Route path='/' element={renderHomePage()}></Route>
                <Route path='/join' element={<RoomJoinPage />} />
                <Route path='/create' element={<CreateRoomPage />} />
                {/* <Route path='/room/:roomCode' element={<Room />} /> */}
                <Route path='/room/:roomCode' element={<Room leaveRoomCallback={clearRoomCode}/>} />
            </Routes>
        </Router>
    );
}
export default HomePage;

/* export default class HomePage extends Component {
    constructor(props){
        super(props);
    }

    // In regards to each Route: React's Router will pass some props to our 
    // element e.g. RoomJoinPage, Room, etc. that will have information 
    // relating to how we got to the corresponding landing url page.
    // The prop we are particularly interested in is 'match'. It can tell 
    // us how it mathched the landing url page with the exact string given
    // in the path, e.g. path='/create'
    render(){
        return ( 
            <Router>
                <Routes>
                    <Route path='/' element={<p>This is the home page</p>}></Route>
                    <Route path='/join' element={<RoomJoinPage />} />
                    <Route path='/create' element={<CreateRoomPage />} />
                    <Route path='/room/:roomCode' element={<Room />} />  
                </Routes>
            </Router>
        );
    }
} */



// <Route path='/join' component={RoomJoinPage} />      old way
// <Route exact path='/' ... might be needed for the home page 