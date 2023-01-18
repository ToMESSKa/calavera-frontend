import { Col, Row } from "antd";
import { React, useRef, useState, useEffect } from "react";
import Dice from "react-dice-roll";
import DiceRollingField from "./DiceRollingField";

function DiceGroupingField(props) {
  return (
    <Col className="dice-grouping-field">
      <Row>
        <Col>
          {Object.keys(props.groupedDiceRolls).map((key, value) => (
            <Row key={Math.random() * Math.random()}>
              {props.groupedDiceRolls[key].map((dice) => (
                <Dice
                  cheatValue={dice.diceColor}
                  onRoll={props.handleClickOnDice}
                  defaultValue={dice.diceColor}
                  faces={props.faces}
                  rollingTime={0}
                  size={40}
                  key={Math.random() * Math.random()}
                ></Dice>
              ))}
            </Row>
          ))}

          {/* {props.groupedDiceRolls.map((group) => (
              <Row key={Math.random() * Math.random()}>
                {group.map((dice) => (
                  <Dice
                    cheatValue={dice.diceColor}
                    onRoll={props.handleClickOnDice}
                    defaultValue={dice.diceColor}
                    faces={props.faces}
                    rollingTime={0}
                    size={40}
                    key={Math.random() * Math.random()}
                  ></Dice>
                ))}
              </Row>))} */}
        </Col>
      </Row>
      <Row></Row>
    </Col>
  );
}

export default DiceGroupingField;
