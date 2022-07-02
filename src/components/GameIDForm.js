import {useRef, useEffect} from 'react';
import { Card } from 'antd';
import "antd/dist/antd.css";
import { getElementError } from "@testing-library/react";


function GameIDForm (props) {

    

    return(
    <div>
        <input ref={props.ref} type="text"></input>
        <button onClick={props.connectToGame}>Join game</button>
    </div>
    );
}
export default GameIDForm;