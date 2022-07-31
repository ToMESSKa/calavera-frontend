import { Button, Card } from 'antd';
import "antd/dist/antd.css";
import Board from "./gameelements/Board";
import React, { useState, useRef } from "react";
import PlayField from './PlayField';
import axios from "axios";
import GameIDForm from './GameIDForm';


function StartGame (props) {

    const [newGame, setNewGame] = useState(false);
    const [gameID, setGameID] = useState(false);
    const [firtsPlayer, setFirstPlayer] = useState(false);
    const [actualPlayer, setActualPlayer] = useState(false);


    const startNewGame = () => {
        setNewGame(true)
        let firtsPlayer = {playerName: "Tamás" };
        axios.post("http://localhost:8080/start", firtsPlayer)
        .then((response) => {
            console.log(response.data.gameId);
            setGameID(response.data.gameId);
            setActualPlayer("first")
        })      
    }

    const connectToGame = (e) =>{
        let gameID = parseInt(e.target.previousSibling.value)
        setGameID(gameID)
        let secondPlayer = {playerName: "Dávid"}
        let game = {player: secondPlayer, gameId: gameID}
        axios.post("http://localhost:8080/connect", game)
        .then((response) => {
            setNewGame(true)
            setGameID(response.data.gameId)
            setActualPlayer("second")
        })      
    }

    


    return(
    <div >
        {newGame ? <div>{false}</div>: <button onClick={startNewGame}>Start new game</button>}
        {newGame ? <div>{false}</div>: <GameIDForm connectToGame={connectToGame}></GameIDForm>}
        {newGame ? <PlayField gameID={gameID} actualPlayer={actualPlayer}></PlayField> : <div>{false}</div>}
    </div>
    )
}
export default StartGame;