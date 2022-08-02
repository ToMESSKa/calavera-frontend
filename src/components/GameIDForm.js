import {useRef, useEffect} from 'react';
import { Card, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { getElementError } from "@testing-library/react";


function GameIDForm (props) {

    const gameIDForm = useRef();

    const getID = (e) =>{
        props.connectToGame(gameIDForm)  
    }


    return(
    <div><Row justify="space-around" align="middle">
        <Col><div>Enter existing game ID</div></Col>
        <Col><input ref={gameIDForm} className="join-game-input" type="text"></input></Col>
        <Col><button onClick={getID}>Join game</button></Col>
        </Row>
        {props.gameNotFound ? <div> Game ID doesn't exist! </div>:<div>{false}</div>}
    </div>
    );
}
export default GameIDForm;