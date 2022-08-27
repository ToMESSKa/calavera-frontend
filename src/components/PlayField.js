import React, {useState, useEffect, useRef } from "react";
import Cell from "./gameelements/Cell";
import {Col, Row} from "antd";
import "antd/dist/antd.css";
import Board from "./gameelements/Board";
import * as SockJS from 'sockjs-client';
import Stomp from 'stompjs'
import BoardRow from "./gameelements/BoardRow";
import DiceField from "./gameelements/DiceField";
import Dice from "react-dice-roll";
import axios from "axios";

function PlayField (props) {

  const [testContent, setTestContent] = useState(0);
  const [markedCells, setMarkedCells] = useState(["","","","","","","","","","","","",""])
  const [playercells, setPlayercells] = useState([])
  const [stomp, setStomp] = useState([])

  const myForm = useRef();

  useEffect(() => {
    }, [testContent]);

  const changeTestContent = () => {
    setTestContent(prevValue => "2");
  }

  // Try to set up WebSocket connection with the handshake at "http://localhost:8080/stomp"
  let sock = new SockJS("http://localhost:8080/stomp");

  // Create a new StompClient object with the WebSocket endpoint
  let client = Stomp.over(sock);

  // Start the STOMP communications, provide a callback for when the CONNECT frame arrives.
  client.connect({}, frame => {
  // Subscribe to "/topic/wstest". Whenever a message arrives add the text in a list-item element in the unordered list.
  client.subscribe("/topic/wstest", payload => {
      setStomp("OK")
    });
  });

  // Take the value in the ‘message-input’ text field and send it to the server with empty headers.
  const sendMessage = () =>{
    let message = "OK"
    client.send('/app/gameplay', {}, JSON.stringify({message: message}));
  }

  const markCells = () =>{
    setMarkedCells(["X","","","","","","","","","","","",""])
  }

  const checkActualPlayer = (e) =>{
    console.log(props.actualPlayer)
  }

    return(
    <div className="play-field">
      {/* <Row>
        
        <Col className="leftDiceField"><DiceField></DiceField></Col>
      </Row> */}
      <div>Game ID: {props.gameID}</div>
      {/* <input ref={myForm}  type="text" name="name" /> */}
      <div>STOMP: {stomp}</div>
      <Row>
          <Col span={12}><DiceField actualPlayer={props.actualPlayer}></DiceField></Col>
          <Col span={12}><DiceField></DiceField></Col>
      </Row>
      <Row>
          <Col className="rightBoard" span={12}><Board testContent={testContent} markedCells={markedCells}></Board></Col>
          <Col className="rightBoard" span={12}><Board testContent={testContent} markedCells={markedCells}></Board></Col>
      </Row>
      {/* <Row>
        <Col className="rightBoard" span={12}><Board testContent={testContent} markedCells={markedCells}></Board></Col>
        <Col className="leftBoard" span={12}><Board testContent={testContent} markedCells={markedCells}></Board></Col>
      </Row> */}
    </div>
    );
}
export default PlayField;