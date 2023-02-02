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

  const playerOneDice1 = useRef();
  const playerOneDice2 = useRef();
  const playerOneDice3 = useRef();
  const playerOneDice4 = useRef();
  const playerOneDice5 = useRef();
  const playerOneDice6 = useRef();

  const [diceReferencesPlayerOne, setDiceReferencesPlayerOne] = useState([
    playerOneDice1,
    playerOneDice2,
    playerOneDice3,
    playerOneDice4,
    playerOneDice5,
    playerOneDice6,
  ]);

  const playerTwoDice1 = useRef();
  const playerTwoDice2 = useRef();
  const playerTwoDice3 = useRef();
  const playerTwoDice4 = useRef();
  const playerTwoDice5 = useRef();
  const playerTwoDice6 = useRef();

  const [diceReferencesPlayerTwo, setDiceReferencesPlayerTwo] = useState([
    playerTwoDice1,
    playerTwoDice2,
    playerTwoDice3,
    playerTwoDice4,
    playerTwoDice5,
    playerTwoDice6,
  ]);

  const [stomp, setStomp] = useState([]);
  const [rerollCounterPlayOne, setRerollCounterPlayerOne] = useState("first");
  const [rerollCounterPlayerTwo, setRerollCounterPlayerTwo] = useState("first");
  const [rerollCounterPlayerOneVisible, setRerollCounterPlayerOneVisible] =
    useState("visible");
  const [rerollCounterPlayerTwoVisible, setRerollCounterPlayerTwoVisible] =
    useState("hidden");
  let intialValue = ["", "", "", "", "", "", "", "", "", "", "", "", ""];
  const [dicesPlayerOneVisible, setDicesPlayerOneVisible] = useState("visible");
  const [dicesPlayerTwoVisible, setDicesPlayerTwoVisible] = useState("hidden");
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
  const [playerToMarkCells, setPlayerToMarkCells] = useState(1);

  const [rollButtonHidden, setRollButtonHidden] = useState(true);

  // const [diceRollResultsPlayOne, setDiceRollResultsPlayerOne] = useState({
  //   diceRolls: [],
  // });
  // const [diceRollResultsPlayerTwo, setDiceRollResultsPlayerTwo] = useState({
  //   diceRolls: [],
  // });

  const [dicesGroupedByColorPlayerOne, setDicesGroupedByColorPlayerOne] =
    useState({
      purple: [],
      black: [],
      orange: [],
      rose: [],
      skull: [],
      turquoise: [],
    });

  const [dicesGroupedByColorPlayerTwo, setDicesGroupedByColorPlayerTwo] =
    useState({
      purple: [],
      black: [],
      orange: [],
      rose: [],
      skull: [],
      turquoise: [],
    });

  const playerOne = 1;
  const playerTwo = 2;

  return (
    <div className="play-field">
      <div>Game ID: {props.gameID}</div>
      <Row>
        <Col span={12}>
          <Col className="rightDiceField">
            <RerollCounter
              counter={rerollCounterPlayOne}
              rerollCounterVisible={rerollCounterPlayerOneVisible}
            ></RerollCounter>
            <DiceField
              playerToMarkCells={playerToMarkCells}
              setPlayerToMarkCells={setPlayerToMarkCells}
              dicesVisible={dicesPlayerOneVisible}
              setDicesVisible={setDicesPlayerOneVisible}
              dicesGroupedByColor={dicesGroupedByColorPlayerOne}
              setDicesGroupedByColor={setDicesGroupedByColorPlayerOne}
              ownerOfDiceField={playerOne}
              setDiceReferences={setDiceReferencesPlayerOne}
              diceReferences={diceReferencesPlayerOne}
              setRerollCounter={setRerollCounterPlayerOne}
              setRerollCounterVisible={setRerollCounterPlayerOneVisible}
              rerollCounter={rerollCounterPlayOne}
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
            <RerollCounter
              counter={rerollCounterPlayerTwo}
              rerollCounterVisible={rerollCounterPlayerTwoVisible}
            ></RerollCounter>
            <DiceField
              playerToMarkCells={playerToMarkCells}
              setPlayerToMarkCells={setPlayerToMarkCells}
              dicesVisible={dicesPlayerTwoVisible}
              setDicesVisible={setDicesPlayerTwoVisible}
              dicesGroupedByColor={dicesGroupedByColorPlayerTwo}
              setDicesGroupedByColor={setDicesGroupedByColorPlayerTwo}
              ownerOfDiceField={playerTwo}
              setDiceReferences={setDiceReferencesPlayerTwo}
              diceReferences={diceReferencesPlayerTwo}
              setRerollCounter={setRerollCounterPlayerTwo}
              rerollCounter={rerollCounterPlayerTwo}
              setRerollCounterVisible={setRerollCounterPlayerTwoVisible}
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
              orangeCells={playerTwoOrangeCells}
              purpleCells={playerTwoPurpleCells}
              turquoiseCells={playerTwoTurquoiseCells}
              blackCells={playerTwoBlackCells}
            ></Board>
          </Col>
        </Col>
      </Row>
    </div>
  );
}
export default PlayField;
