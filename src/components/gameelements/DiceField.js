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
import DiceGroupingField from "./DiceGroupingField";
import RerollSelectionField from "./RerollSelectionField";
import DiceRollingField from "./DiceRollingField";

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
    const [sortedDiceByColor, setSortedDiceByColor] = useState({purple:[], black:[], orange:[], rose:[], skull:[], turquoise:[]});
    const [dicesVisible, setDicesVisible] = useState(true);
    const [selectedDiceForReroll, setSelectedDiceForReroll] = useState([]);
    const [rerollButtonVisible, setRerollButtonVisible] = useState(false);
    const [numberOfRerolledDice, setNumberOfRerolledDice] = useState(6);

    useEffect(() => {
        rollAllDicesForTheOtherPlayer();
      },[cheatValues]);

    

    let sock = new SockJS("http://localhost:8080/stomp");

    let client = Stomp.over(sock);
    let counter = 0;
    let counterForOtherPlayer = 0;


    client.connect({}, frame => {
    client.subscribe("/topic/getdicerollresult", payload => {
        if (props.actualPlayer === "second"){
            // groupForTheOtherPlayer(JSON.parse(payload.body).diceRolls)
            // setDiceRolls(JSON.parse(payload.body).diceRolls);
            setRollsForTheOtherPlayer(JSON.parse(payload.body).diceRolls)
            setTimeout(function() {groupForTheOtherPlayer(JSON.parse(payload.body).diceRolls)}, 1000);
            // groupForTheOtherPlayer(JSON.parse(payload.body).diceRolls)
            // groupDiceRolls()
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
            groupDiceRolls(diceRolls.diceRolls)
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
            if (counter === numberOfRerolledDice){
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
            setDiceRolls(rolls)
        }

        const groupForTheOtherPlayer = (rolls) => {
            if (props.actualPlayer === "second"){
                console.log(rolls)
                groupDiceRolls(rolls)
            }
            console.log("other")
            
        }

        const selectForReroll = (value) => {
            let isFound = false;
            if (value !== 5){
            for (let group of groupedDiceRolls){
                for(let dice of group){
                    if (dice.diceValue === value){
                        group.pop()
                        selectedDiceForReroll.push(dice)
                        setSelectedDiceForReroll([...selectedDiceForReroll])
                        isFound = true;
                        break;
                        }
                }
                if (isFound){
                    break;
                }
            }
            setGroupedDiceRolls([...groupedDiceRolls])
            console.log(selectedDiceForReroll)
            if (selectedDiceForReroll !== []){
                setRerollButtonVisible(true)
                console.log("true")
            } 
            }
    }

    const cancelForReroll = (value) => {
        let isFound = false;
        for (let group of groupedDiceRolls){
            if (isFound){
                break;
            }
            for(let dice of group){
                if (dice.diceValue === value){
                    group.push(dice)
                    isFound = true;
                    break;
                    }
            }
        }
        if (!isFound){
            groupedDiceRolls.push([{diceNumber: "example", diceValue: value}])
        }
        for (let dice of selectedDiceForReroll){
            if (dice.diceValue === value){
                selectedDiceForReroll.splice(selectedDiceForReroll.indexOf(dice), 1)
                break;
            }
        }
        setSelectedDiceForReroll([...selectedDiceForReroll])
        console.log(selectedDiceForReroll)
        setGroupedDiceRolls([...groupedDiceRolls])
        if (selectedDiceForReroll.length === 0){
            setRerollButtonVisible(false)
        }
        }

        const groupDiceRolls = (rolls) => {
            for (let dice of rolls){
                if (dice.diceValue === 1){
                    sortedDiceByColor.purple.push(dice)
                }else if(dice.diceValue === 2){
                    sortedDiceByColor.black.push(dice)
                }else if(dice.diceValue === 3){
                    sortedDiceByColor.orange.push(dice)
                }else if(dice.diceValue === 4){
                    sortedDiceByColor.rose.push(dice)
                }else if(dice.diceValue === 5){
                    sortedDiceByColor.skull.push(dice)
                }else if(dice.diceValue === 6){
                    sortedDiceByColor.turquoise.push(dice)
                }
            }
            let arr =[]
            for (const [key, value] of Object.entries(sortedDiceByColor)) {
                if (value.length !== 0){
                    arr.push(value)
                }
              }
            console.log(sortedDiceByColor)
            setSortedDiceByColor(sortedDiceByColor)
            setGroupedDiceRolls(arr)
            setDicesVisible(false)
        }

        const reRoll = (rolls) => {
            setDiceRolls({diceRolls: selectedDiceForReroll})
            setSelectedDiceForReroll([])
            setNumberOfRerolledDice(selectedDiceForReroll.length)
            setDicesVisible(true)
            setRerollButtonVisible(false)
        }





    return(
        <div className="dice-field">
             <Row>
                <Col>
                    <DiceGroupingField dicesVisible={dicesVisible}
                    myDice={myDice}
                    cheatValues={cheatValues}
                    getDiceValue={getDiceValue}
                    selectForReroll={selectForReroll} groupedDiceRolls={groupedDiceRolls} faces={faces}></DiceGroupingField>
                </Col>
                <Col>
                    <RerollSelectionField reRoll={reRoll} selectedDiceForReroll={selectedDiceForReroll} cancelForReroll={cancelForReroll} rerollButtonVisible={rerollButtonVisible} faces={faces}></RerollSelectionField>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DiceRollingField diceRolls ={diceRolls} dicesVisible={dicesVisible} myDice={myDice} cheatValues={cheatValues} getDiceValue={getDiceValue} faces={faces} ></DiceRollingField>
                </Col>
            </Row> 
            <Row>
                {dicesVisible ? <button onClick={rollAllDices}>Roll</button> : <div>{false}</div>}
            </Row>  
        </div> 
        
        );
    }

export default DiceField;