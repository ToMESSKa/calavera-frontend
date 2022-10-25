import './App.css';
import Board from './components/gameelements/Board';
import Game from './components/StartGame';
import "antd/dist/antd.css";
import {Card, Space, Col, Row, Button} from "antd";
import axios from "axios";
import Dice from 'react-dice-roll';
import * as SockJS from 'sockjs-client';
import Stomp from 'stompjs'
import StartGame from './components/StartGame';
import {
  StompSessionProvider,
} from "react-stomp-hooks";

const savePlayer = () =>{
  const player = { id: "1234", playerName: "player"};
  axios
    .get("http://localhost:8080/wstest")
            .then((response) => {
                console.log(response);
      })
  // axios
  // .post("http://localhost:8080/registernewplayer", player)
  // .then((response) => {
  //   console.log("hi");
  // })
}

// Try to set up WebSocket connection with the handshake at "http://localhost:8080/stomp"
let sock = new SockJS("http://localhost:8080/stomp");

// Create a new StompClient object with the WebSocket endpoint
let client = Stomp.over(sock);

// Start the STOMP communications, provide a callback for when the CONNECT frame arrives.
client.connect({}, frame => {
    // Subscribe to "/topic/wstest". Whenever a message arrives add the text in a list-item element in the unordered list.
    client.subscribe("/topic/wstest", payload => {
        console.log(JSON.parse(payload.body))
    });

});

// Take the value in the ‘message-input’ text field and send it to the server with empty headers.
const sendMessage = () =>{
    let message = "OK"
    client.send('/app/gameplay', {}, JSON.stringify({message: message}));
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <StompSessionProvider
      url={"http://localhost:8080/stomp"}
      >
        <StartGame></StartGame>
    </StompSessionProvider>
      </header>
    </div>
  );
}

export default App;
