import React, {useState, useEffect } from "react";
import Cell from "./Cell";
import {Col, Row} from "antd";
import "antd/dist/antd.css";
import Board from "./Board";

function PlayField (props) {
    
    return(
    <div className="play-field">
      <div>Game ID: {props.gameID}</div>
      <Row>
        <Col className="leftColumn" span={12}><Board></Board></Col>
        <Col className="rightColumn" span={12}><Board></Board></Col>
      </Row>
    </div>
    );
}
export default PlayField;