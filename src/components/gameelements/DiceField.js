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

function DiceField (props) {

    const myDice = useRef(null)

    const faces = [
        purple,
        black,
        orange,
        rose,
        skull,
        turquoise
      ];


      let element = useRef(null);
      const mouseClickEvents = ['mousedown', 'click', 'mouseup'];

        function simulateMouseClick(e){
            console.log(e.target.previousSibling)
            e.target.previousSibling.click()

//             mouseClickEvents.forEach(mouseEventType =>
//                 e.target.previousSibling.dispatchEvent(
//             new MouseEvent(mouseEventType, {
//           view: window,
//           bubbles: true,
//           cancelable: true,
//           buttons: 1
//       })
//     )
//   );
}


    return(
        <div className="dice-field">
            
        <Row gutter={10}>
            
            <Dice faces={faces} ref={myDice} size={50}></Dice>
            <button onClick={simulateMouseClick}>Clikc</button>
            <Col><Dice faces={faces} size={50}></Dice></Col>
            <Col><Dice faces={faces} size={50}></Dice></Col>
            <Col><Dice faces={faces} size={50}></Dice></Col>
            <Col><Dice faces={faces} size={50}></Dice></Col>
        </Row>
        </div>
        );
    }

export default DiceField;