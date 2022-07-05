import Cell from "./Cell";
import {Col, Row} from "antd";
import React from "react";

function DiceField (props) {

    return(
        <div className="dice-field">
        <Row>
            <Col>DICE</Col>
            <Col>DICE</Col>
            <Col>DICE</Col>
            <Col>DICE</Col>
        </Row>
        </div>
        );
    }

export default DiceField;