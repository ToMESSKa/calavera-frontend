import {useRef, useEffect} from 'react';
import { Card, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { getElementError } from "@testing-library/react";


function GameIDForm (props) {

    return(
    <div><Row justify="space-around" align="middle">
        <Col><div>Enter existing game ID</div></Col>
        <Col><input className="join-game-input" ref={props.ref} type="text"></input></Col>
        <Col><button onClick={props.connectToGame}>Join game</button></Col>
        </Row>
    </div>
    );
}
export default GameIDForm;