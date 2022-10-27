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

  return (
    <div className="play-field">
      <div>Game ID: {props.gameID}</div>
      <div>STOMP: {stomp}</div>
      <Row>
        <RerollCounter rerollCounter={rerollCounter}></RerollCounter>
      </Row>
      <Row>
        <Col span={12}>
          <DiceField
            setRerollCounter={setRerollCounter}
            rerollCounter={rerollCounter}
            actualPlayer={props.actualPlayer}
          ></DiceField>
        </Col>
        <Col span={12}>
          <DiceField></DiceField>
        </Col>
      </Row>
      <Row>
        <Col className="rightBoard" span={12}>
          <Board testContent={testContent} markedCells={markedCells}></Board>
        </Col>
        <Col className="rightBoard" span={12}>
          <Board testContent={testContent} markedCells={markedCells}></Board>
        </Col>
      </Row>
    </div>
  );
}
export default PlayField;
