import { Row } from "antd";
import { React, useRef, useState, useEffect } from "react";
import Dice from "react-dice-roll";

function DiceRollingField(props) {
  return (
    <div className="dice-rolling-field">
      {props.dicesVisible ? (
        <Row gutter={1}>
          {props.diceRolls.diceRolls.map((dice, index) => (
            <Dice
              disabled={true}
              ref={props.allDiceToRoll[index]}
              defaultValue={dice.diceValue}
              cheatValue={props.cheatValues[index]}
              onRoll={(value) =>
                props.getDiceValue(value, "dice" + (index + 1))
              }
              faces={props.faces}
              size={40}
              key={Math.random() * Math.random()}
            ></Dice>
          ))}
        </Row>
      ) : (
        <div>{false}</div>
      )}
    </div>
  );
}

export default DiceRollingField;
