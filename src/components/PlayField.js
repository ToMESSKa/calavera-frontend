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

  const [orangeCells, setOrangeCells] = useState(intialValue);

  return (
    <div className="play-field">
      <div>Game ID: {props.gameID}</div>
      <div>STOMP: {stomp}</div>
      <Row>
        <Col><RerollCounter rerollCounter={rerollCounter}></RerollCounter></Col>
      </Row>
      <Row>
        <Col span={12}>
          <DiceField
            setRerollCounter={setRerollCounter}
            rerollCounter={rerollCounter}
            actualPlayer={props.actualPlayer}
            setOrangeCells={setOrangeCells}
            orangeCells={orangeCells}
          ></DiceField>
        </Col>
        <Col span={12}>
          <DiceField></DiceField>
        </Col>
      </Row>
      <Row>
        <Col className="rightBoard" span={12}>
          <Board orangeCells={orangeCells} testContent={testContent} markedCells={markedCells}></Board>
        </Col>
        <Col className="rightBoard" span={12}>
          <Board  orangeCells={orangeCells} testContent={testContent} markedCells={markedCells}></Board>
        </Col>
      </Row>
    </div>
  );
}
export default PlayField;
