import React, { Component } from "react";
//import { render } from "react-dom";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";


function App() {
    return (
        <div className="center">
            <HomePage />
        </div>
    );
}

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);


/* // export default allows this class to be singularly imported as
// "import whatevername from ./components/App"
export default class App extends Component {
    constructor(props) {
        super(props); // passes properties (props) to Component's constructor 
    }

    render(){
        return (<div className="center">
            <HomePage />
            </div>
        );
        // return (<h1>{this.props.name}</h1>);
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv); // we render this app in id=app div in index.html
 */