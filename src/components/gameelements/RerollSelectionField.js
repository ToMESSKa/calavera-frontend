import {React, useRef, useState, useEffect} from "react";
import Dice from "react-dice-roll";


function RerollSelectionField (props) {

    return(
        <div className="reroll-selection-field">
                {(props.selectedDiceForReroll).map((dice) => (
                    <Dice defaultValue={dice.diceValue} key={Math.random() * Math.random()} faces={props.faces} size={40}></Dice>
        ))}
        </div>
    )}

export default RerollSelectionField;