import React, { useState, useEffect, useRef } from "react";
import Cell from "./gameelements/Cell";
import { Col, Row } from "antd";
import "antd/dist/antd.css";
import Board from "./gameelements/Board";
import * as SockJS from "sockjs-client";
import Stomp from "stompjs";
import BoardRow from "./gameelements/BoardRow";
import DiceField from "./gameelements/DiceField";
import Dice from "react-dice-roll";
import axios from "axios";
import RerollCounter from "./gameelements/RerollCounter";

function PlayField(props) {
  const [testContent, setTestContent] = useState(0);

  const [markedCells, setMarkedCells] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [stomp, setStomp] = useState([]);
  const [rerollCounter, setRerollCounter] = useState("first");
  let intialValue = ["", "", "", "", "", "", "", "", "", "", "", "", ""];

  const [playerOneOrangeCells, setPlayerOneOrangeCells] = useState(intialValue);
  const [playerOnePurpleCells, setPlayerOnePurpleCells] = useState(intialValue);
  const [playerOneTurquoiseCells, setPlayerOneTurquoiseCells] =
    useState(intialValue);
  const [playerOneBlackCells, setPlayerOneBlackCells] = useState(intialValue);

  const [playerTwoOrangeCells, setPlayerTwoOrangeCells] = useState(intialValue);
  const [playerTwoPurpleCells, setPlayerTwoPurpleCells] = useState(intialValue);
  const [playerTwoTurquoiseCells, setPlayerTwoTurquoiseCells] =
    useState(intialValue);
  const [playerTwoBlackCells, setPlayerTwoBlackCells] = useState(intialValue);

  const [rollButtonHidden, setRollButtonHidden] = useState(true);

  return (
    <div className="play-field">
      <div>Game ID: {props.gameID}</div>
      <Row>
        <Col span={12}>
          <Col className="rightDiceField">
            <RerollCounter rerollCounter={rerollCounter}></RerollCounter>
            <DiceField
              setRerollCounter={setRerollCounter}
              rerollCounter={rerollCounter}
              playerIDForGame={props.playerIDForGame}
              setPlayerOneOrangeCells={setPlayerOneOrangeCells}
              setPlayerOneBlackCells={setPlayerOneBlackCells}
              setPlayerOnePurpleCells={setPlayerOnePurpleCells}
              setPlayerOneTurquoiseCells={setPlayerOneTurquoiseCells}
              setPlayerTwoOrangeCells={setPlayerTwoOrangeCells}
              setPlayerTwoBlackCells={setPlayerTwoBlackCells}
              setPlayerTwoPurpleCells={setPlayerTwoPurpleCells}
              setPlayerTwoTurquoiseCells={setPlayerTwoTurquoiseCells}
            ></DiceField>
          </Col>
          <Col className="rightBoard">
            <Board
              orangeCells={playerOneOrangeCells}
              purpleCells={playerOnePurpleCells}
              turquoiseCells={playerOneTurquoiseCells}
              blackCells={playerOneBlackCells}
            ></Board>
          </Col>
        </Col>

        <Col span={12}>
          <Col className="leftDiceField">
            <RerollCounter rerollCounter={rerollCounter}></RerollCounter>
            <DiceField
              setRerollCounter={setRerollCounter}
              rerollCounter={rerollCounter}
              playerIDForGame={props.playerIDForGame}
              setPlayerOneOrangeCells={setPlayerOneOrangeCells}
              setPlayerOneBlackCells={setPlayerOneBlackCells}
              setPlayerOnePurpleCells={setPlayerOnePurpleCells}
              setPlayerOneTurquoiseCells={setPlayerOneTurquoiseCells}
              setPlayerTwoOrangeCells={setPlayerTwoOrangeCells}
              setPlayerTwoBlackCells={setPlayerTwoBlackCells}
              setPlayerTwoPurpleCells={setPlayerTwoPurpleCells}
              setPlayerTwoTurquoiseCells={setPlayerTwoTurquoiseCells}
            ></DiceField>
          </Col>
          <Col className="rightBoard">
            <Board
              orangeCells={playerOneOrangeCells}
              purpleCells={playerOnePurpleCells}
              turquoiseCells={playerOneTurquoiseCells}
              blackCells={playerOneBlackCells}
            ></Board>
          </Col>
        </Col>
      </Row>
    </div>
  );
}
export default PlayField;
