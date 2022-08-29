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
import Column from "antd/lib/table/Column";

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

    // const groupedDiceRolls = 
    // {purple:[], black:[], orange:[], rose:[], skull:[], turquoise:[]}


    const myDice = useRef();
    const [cheatValues, setCheatValues] = useState([]);
    const [diceRolls, setDiceRolls] = useState(defaultDiceRolls);
    const [groupedDiceRolls, setGroupedDiceRolls] = useState([]);
    const [dicesVisible, setDicesVisible] = useState(true);

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
            groupDiceRolls()
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
            setDiceRolls(diceRolls)
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

        const groupDiceRolls = () => {
            let groupedDiceRolls = {purple:[], black:[], orange:[], rose:[], skull:[], turquoise:[]}
            for (let dice of diceRolls.diceRolls){
                if (dice.diceValue === 1){
                    groupedDiceRolls.purple.push(dice)
                }else if(dice.diceValue === 2){
                    groupedDiceRolls.black.push(dice)
                }else if(dice.diceValue === 3){
                        groupedDiceRolls.orange.push(dice)
                }else if(dice.diceValue === 4){
                    groupedDiceRolls.rose.push(dice)
                }else if(dice.diceValue === 5){
                    groupedDiceRolls.skull.push(dice)
                }else if(dice.diceValue === 6){
                        groupedDiceRolls.turquoise.push(dice)
                }
            }
            let arr =[]
            for (const [key, value] of Object.entries(groupedDiceRolls)) {
                if (value.length !== 0){
                    arr.push(value)
                }
              }
            setGroupedDiceRolls(arr)
            setDicesVisible(false)
        }   
      

    return(
        <div className="dice-field">
             <Row>
                <Col>
            <div className="dice-grouping-field">
                <Col>
                {(groupedDiceRolls).map((group, index) => (
                    <Row key={Math.random() * Math.random()}>
                    {group.map((dice => 
                    <Dice defaultValue={dice.diceValue} faces={faces} size={40} key={Math.random() * Math.random()}></Dice>
                        )) 
                    }
                    </Row>
                ))
                }
                </Col>
            </div>
            </Col>
            <Col>
            <div className="reroll-selection-field">
            </div>
            </Col>
            </Row>    
        <div className="dice-rolling-field"> 
        {dicesVisible ? <Row ref={myDice}  gutter={1}>
            <Dice cheatValue={cheatValues[0]} onRoll={(value) => getDiceValue(value, "dice1")} faces={faces} size={40}></Dice>
            <Dice cheatValue={cheatValues[1]} onRoll={(value) => getDiceValue(value, "dice2")} faces={faces} size={40}></Dice>
            <Dice cheatValue={cheatValues[2]} onRoll={(value) => getDiceValue(value, "dice3")} faces={faces} size={40}></Dice>
            <Dice cheatValue={cheatValues[3]} onRoll={(value) => getDiceValue(value, "dice4")} faces={faces} size={40}></Dice>
            <Dice cheatValue={cheatValues[4]} onRoll={(value) => getDiceValue(value, "dice5")} faces={faces} size={40}></Dice>
            <Dice cheatValue={cheatValues[5]} onRoll={(value) => getDiceValue(value, "dice6")} faces={faces} size={40}></Dice>
        </Row> : <div>{false}</div>}
        </div>
        {dicesVisible ? 
        <button onClick={rollAllDices}>Roll</button>
        : <div>{false}</div>}
        </div>
        );
    }

export default DiceField;