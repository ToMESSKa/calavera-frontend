import { Button, Card } from 'antd';
import "antd/dist/antd.css";
import Board from "./Board";
import React, { useState, useEffect } from "react";


function StartGame (props) {

    const [newGame, setNewGame] = useState(false);


    const startNewGame = () =>{
        setNewGame(true)
    }

    return(
    <div >
        {newGame ? <div>{false}</div>: <button onClick={startNewGame}>Start new game</button>}
        <button>Join exsisting game</button>
        {newGame ? <Board></Board> : <button>Login</button>}
    </div>
    );
}
export default StartGame;