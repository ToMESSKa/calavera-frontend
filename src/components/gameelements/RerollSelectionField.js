import {React, useRef, useState, useEffect} from "react";
import Dice from "react-dice-roll";


function RerollSelectionField (props) {

    

    return(
        <div><div className="reroll-selection-field">
        {(props.selectedDiceForReroll).map((dice) => (
            <Dice cheatValue={dice.diceValue} onRoll={props.cancelForReroll} defaultValue={dice.diceValue} key={Math.random() * Math.random()} faces={props.faces} rollingTime={0} size={40}></Dice>
        ))}
        </div>
        <div>{props.rerollButtonVisible ? <button onClick={props.reRoll} className="reroll-button">Reroll!</button> : <div>{false}</div>}
        </div>
        </div>

    )}

export default RerollSelectionField;