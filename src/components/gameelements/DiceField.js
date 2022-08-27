import Cell from "./Cell";
import {Col, Row} from "antd";
import {React, useRef, useState, useEffect} from "react";
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

    const defaultDiceRolls = 
    {diceRolls:[
        {diceNumber:"dice1", diceValue:1},
        {diceNumber:"dice2", diceValue:1},
        {diceNumber:"dice3", diceValue:1},
        {diceNumber:"dice4", diceValue:1}, 
        {diceNumber:"dice5", diceValue:1},
        {diceNumber:"dice6", diceValue:1}
    ]}


    const myDice = useRef();
    // const [myDice, setMyDice] = useState([]);
    const [cheatValues, setCheatValues] = useState([]);
    const [diceRolls, setDiceRolls] = useState(defaultDiceRolls);

    useEffect(() => {
        rollAllDicesForTheOtherPlayer();
      },[cheatValues]);
    

    let sock = new SockJS("http://localhost:8080/stomp");

    let client = Stomp.over(sock);
    let counter = 0;


    client.connect({}, frame => {
    client.subscribe("/topic/getdicerollresult", payload => {
        if (props.actualPlayer === "second"){
            setRollsForTheOtherPlayer(JSON.parse(payload.body).diceRolls)
        }
        })
    });

    
    const faces = [
        purple,
        black,
        orange,
        rose,
        skull,
        turquoise
      ];
    

        const sendDiceResults = (e) => {
            client.send('/app/rolldice', {}, JSON.stringify(diceRolls))
        };

        const rollAllDices = (e) => {
            let dices = myDice.current.children;
            for (let dice of dices) {
                dice.click();
            }   
        }   

        const rollAllDicesForTheOtherPlayer = (e) => {
                let dices = myDice.current.children;
                for (let dice of dices) {
                    dice.click();
                }
            } 
        

        const getDiceValue = (value, number) => {
            if (props.actualPlayer === "first"){
            for (let dice of diceRolls.diceRolls){
                if (dice.diceNumber === number){
                    dice.diceValue = value
                    }
                }
            counter = counter + 1;
            if (counter === 6){
                sendDiceResults()
                counter = 0;
            }
            }
        }

        const setRollsForTheOtherPlayer = (rolls) => {
            let values = [
                rolls[0].diceValue,
                rolls[1].diceValue,
                rolls[2].diceValue,
                rolls[3].diceValue,
                rolls[4].diceValue,
                rolls[5].diceValue
            ];
            setCheatValues(values)
        }
      

    return(
        <div className="dice-field">
            <button onClick={rollAllDices}>Roll</button>
        <Row ref={myDice}  gutter={10}>
            <Dice cheatValue={cheatValues[0]} onRoll={(value) => getDiceValue(value, "dice1")} faces={faces} size={50}></Dice>
            <Dice cheatValue={cheatValues[1]} onRoll={(value) => getDiceValue(value, "dice2")} faces={faces} size={50}></Dice>
            <Dice cheatValue={cheatValues[2]} onRoll={(value) => getDiceValue(value, "dice3")} faces={faces} size={50}></Dice>
            <Dice cheatValue={cheatValues[3]} onRoll={(value) => getDiceValue(value, "dice4")} faces={faces} size={50}></Dice>
            <Dice cheatValue={cheatValues[4]} onRoll={(value) => getDiceValue(value, "dice5")} faces={faces} size={50}></Dice>
            <Dice cheatValue={cheatValues[5]} onRoll={(value) => getDiceValue(value, "dice6")} faces={faces} size={50}></Dice>
        </Row>
        </div>
        );
    }

export default DiceField;