import { Button, Card } from 'antd';
import "antd/dist/antd.css";
import Board from "./Board";
import React, { useState, useEffect } from "react";
import PlayField from './PlayField';
import axios from "axios";


function StartGame (props) {

    const [newGame, setNewGame] = useState(false);
    const [gameID, setGameID] = useState(false);


    const startNewGame = () =>{
        setNewGame(true)
        let newPlayer = {playerName: "Tamás" };
        axios.post("http://localhost:8080/start", newPlayer)
        .then((response) => {
            console.log(response.data.gameId);
            setGameID(response.data.gameId)
        })      
    }

    return(
    <div >
        {newGame ? <div>{false}</div>: <button onClick={startNewGame}>Start new game</button>}
        {newGame ? <div>{false}</div>: <button onClick={startNewGame}>Join existing game</button>}
        {newGame ? <PlayField gameID={gameID}></PlayField> : <div>{false}</div>}
    </div>
    )
}
export default StartGame;