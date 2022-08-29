import {Row} from "antd";
import {React, useRef, useState, useEffect} from "react";
import Dice from "react-dice-roll";


function DiceRollingField (props) {

    return(
        <div className="dice-rolling-field"> 
        {props.dicesVisible ? <Row ref={props.myDice}  gutter={1}>
            <Dice cheatValue={props.cheatValues[0]} onRoll={(value) => props.getDiceValue(value, "dice1")} faces={props.faces} size={40}></Dice>
            <Dice cheatValue={props.cheatValues[1]} onRoll={(value) => props.getDiceValue(value, "dice2")} faces={props.faces} size={40}></Dice>
            <Dice cheatValue={props.cheatValues[2]} onRoll={(value) => props.getDiceValue(value, "dice3")} faces={props.faces} size={40}></Dice>
            <Dice cheatValue={props.cheatValues[3]} onRoll={(value) => props.getDiceValue(value, "dice4")} faces={props.faces} size={40}></Dice>
            <Dice cheatValue={props.cheatValues[4]} onRoll={(value) => props.getDiceValue(value, "dice5")} faces={props.faces} size={40}></Dice>
            <Dice cheatValue={props.cheatValues[5]} onRoll={(value) => props.getDiceValue(value, "dice6")} faces={props.faces} size={40}></Dice>
        </Row> : <div>{false}</div>}
        </div>
        );
    }

export default DiceRollingField;