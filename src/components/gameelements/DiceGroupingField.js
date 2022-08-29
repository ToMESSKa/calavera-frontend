import {Col, Row} from "antd";
import {React, useRef, useState, useEffect} from "react";
import Dice from "react-dice-roll";


function DiceGroupingField (props) {

    return(
            <div className="dice-grouping-field">
                <Col>
                {(props.groupedDiceRolls).map((group, index) => (
                    <Row key={Math.random() * Math.random()}>
                    {group.map((dice => 
                    <Dice defaultValue={dice.diceValue} faces={props.faces} size={40} key={Math.random() * Math.random()}></Dice>
                        )) 
                    }
                    </Row>
                ))
                }
                </Col>
            </div>
        );
    }

export default DiceGroupingField;