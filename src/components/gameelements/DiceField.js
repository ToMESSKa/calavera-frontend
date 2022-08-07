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
    const defaultDiceRolls = [
    {diceNumber : "dice1", value: 1},
    {diceNumber : "dice2", value: 1},
    {diceNumber : "dice3", value: 1},
    {diceNumber : "dice4", value: 1},
    {diceNumber : "dice5", value: 1},
    {diceNumber : "dice6", value: 1}

];

    const [diceRolls, setDiceRolls] = useState(defaultDiceRolls);


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
            console.log(diceRolls)
            client.send('/app/rolldice', {}, JSON.stringify(diceRolls));
        }

        const rollAllDicesForTheOtherPlayer = (e) => {;
            let dices = myDice.current.children;
            for (let dice of dices) {
                dice.click();
            }

        }

        // const getDiceValue = (value, dice) => {;
        //     setDiceRolls(diceRolls => [...diceRolls, value])
        //     console.log(diceRolls)
        // }

        const getDiceValue = (diceValue, number) => {;
            for (let dice of diceRolls){
                if (dice.diceNumber === number) {
                  dice.value = diceValue
                }
            }
        }
      

    return(
        <div className="dice-field">
            <button onClick={rollAllDices}>Roll</button>
        <Row ref={myDice}  gutter={10}>
            <Dice onRoll={(value) => getDiceValue(value, "dice1")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "dice2")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "dice3")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "dice4")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "dice5")} faces={faces} size={50}></Dice>
            <Dice onRoll={(value) => getDiceValue(value, "dice6")} faces={faces} size={50}></Dice>
        </Row>
        </div>
        );
    }

export default DiceField;