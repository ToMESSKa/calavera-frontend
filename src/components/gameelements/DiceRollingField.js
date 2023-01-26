import { Row } from "antd";
import { React, useRef, useState, useEffect } from "react";
import Dice from "react-dice-roll";

function DiceRollingField(props) {
  return (
    <div style={{visibility: props.dicesVisible }}  className="dice-rolling-field">
        <Row gutter={1}>
          {props.dicesToBeRolled.diceRolls.map((dice, index) => (
            <Dice
              disabled={true}
              ref={props.diceReferences[index]}
              defaultValue={dice.diceColor}
              cheatValue={props.presetColorForRollResult[index]}
              onRoll={(value) =>
                props.getDiceValue(value, "dice" + (index + 1))
              }
              faces={props.faces}
              size={40}
              key={Math.random() * Math.random()}
            ></Dice>
          ))}
        </Row>
    </div>
  );
}

export default DiceRollingField;
