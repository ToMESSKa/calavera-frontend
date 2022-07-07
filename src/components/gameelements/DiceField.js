import Cell from "./Cell";
import {Col, Row} from "antd";
import {React, useRef} from "react";
import Dice from "react-dice-roll";
import purple from '../../static/purple.jpg';
import black from '../../static/black.jpg';
import turquoise from '../../static/turquoise.jpg';
import orange from '../../static/orange.jpg';
import skull from '../../static/skull.jpg';
import rose from '../../static/rose.jpg';
import ReactDOM from 'react-dom'

function DiceField (props) {

    const myDice = useRef()

    const faces = [
        purple,
        black,
        orange,
        rose,
        skull,
        turquoise
      ];

        const rollAllDices = (e) => {;
            let dices = myDice.current.children;
            for (let dice of dices) {
                dice.click();
            }
        }

        const findAllDice = () => {
            console.log(props.children)
        
        }

    return(
        <div className="dice-field">
            <button onClick={rollAllDices}>Roll</button>
        <Row ref={myDice}  gutter={10}>
            <Dice onRoll={(value) => console.log(value)} faces={faces} size={50}></Dice>
            <Dice faces={faces} size={50}></Dice>
            <Dice faces={faces} size={50}></Dice>
            <Dice faces={faces} size={50}></Dice>
        </Row>
        </div>
        );
    }

export default DiceField;