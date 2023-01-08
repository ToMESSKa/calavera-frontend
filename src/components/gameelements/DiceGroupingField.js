import { Col, Row } from "antd";
import { React, useRef, useState, useEffect } from "react";
import Dice from "react-dice-roll";
import DiceRollingField from "./DiceRollingField";

function DiceGroupingField(props) {
  return (
    <Col className="dice-grouping-field">
      <Row>
        <div>
          <Col>
            {props.groupedDiceRolls.map((group, index) => (
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
              </Row>
            ))}
          </Col>
        </div>
      </Row>
      <Row></Row>
    </Col>
  );
}

export default DiceGroupingField;
