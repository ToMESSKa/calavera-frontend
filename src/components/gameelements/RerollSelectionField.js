import { React, useRef, useState, useEffect } from "react";
import Dice from "react-dice-roll";
import { Col, Row } from "antd";

function RerollSelectionField(props) {
  return (
    <div>
      <Col className="reroll-selection-field">
          <Row>
            <Col>
              {Object.keys(props.selectedDicesForReroll).map((key, value) => (
                <Row key={Math.random() * Math.random()}>
                  {props.selectedDicesForReroll[key].map((dice) => (
                    <Dice
                      cheatValue={dice.diceColor}
                      onRoll={props.cancelDiceForReroll}
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
          </Row>
          <Row></Row>
        </Col>
    </div>
  );
}

export default RerollSelectionField;
