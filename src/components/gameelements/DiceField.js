import Cell from "./Cell";
import {Col, Row} from "antd";
import {React, useRef, useState} from "react";
import Dice from "react-dice-roll";
import purple from '../../static/purple.jpg';
import black from '../../static/black.jpg';
import turquoise from '../../static/turquoise.jpg';
import orange from '../../static/orange.jpg';
import skull from '../../static/skull.jpg';
import rose from '../../static/rose.jpg';
import ReactDOM from 'react-dom'
import * as SockJS from 'sockjs-client';
import Stomp from 'stompjs'

function DiceField (props) {

    const myDice = useRef()
    const firstDice = useRef()
    const [diceRolls, setDiceRolls] = useState([])

    let sock = new SockJS("http://localhost:8080/stomp");

    let client = Stomp.over(sock);

    client.connect({}, frame => {
    client.subscribe("/topic/dicerollresult", payload => {
        if (props.actualPlayer === "second"){
            console.log(JSON.parse(payload.body));
            rollAllDicesForTheOtherPlayer();
        }
        });
    });

    const faces = [
        purple,
        black,
        orange,
        rose,
        skull,
        turquoise
      ];
    

        const rollAllDices = (e) => {;
            let dices = myDice.current.children;
            for (let dice of dices) {
                dice.click();
            }
            let diceRoll = {diceRolls: {dice1: "2", dice2: "2"}}
            client.send('/app/rolldice', {}, JSON.stringify(diceRoll));
        }

        const rollAllDicesForTheOtherPlayer = (e) => {;
            let dices = myDice.current.children;
            for (let dice of dices) {
                dice.click();
            }
        }

        const getDiceValue = (value, dice) => {;
            console.log(value)
            console.log(dice)
        }

    return(
        <div className="dice-field">
            <button onClick={rollAllDices}>Roll</button>
        <Row ref={myDice}  gutter={10}>
            <Dice onRoll={(value) => getDiceValue(value, "first")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "first")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "first")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "first")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "first")} faces={faces} size={50}></Dice>
        </Row>
        </div>
        );
    }

export default DiceField;