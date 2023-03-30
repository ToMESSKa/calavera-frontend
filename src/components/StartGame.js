import { Button, Card, Col, Row } from 'antd';
import "antd/dist/antd.css";
import Board from "./gameelements/Board";
import React, { useState, useRef } from "react";
import PlayField from './PlayField';
import axios from "axios";
import GameIDForm from './GameIDForm';
import SignIn from './SignIn';


function StartGame (props) {

    const [newGame, setNewGame] = useState(false);
    const [gameNotFound, setGameNotFound] = useState(false);
    const [gameID, setGameID] = useState(false);
    const [playerID, setPlayerID] = useState(false);
    const [playerToMarkCells, setPlayerToMarkCells] = useState(1);


    const startNewGame = () => {
        setNewGame(true)
        let firstPlayer = {playerName: "Player1"};
        setPlayerID(1)
        axios.post("http://localhost:8080/startnewgame", firstPlayer)
        .then((response) => {
            setGameID(response.data.gameId);
        })      
    }

    const joinGame = (e) =>{
        let gameID = parseInt(e.current.value)
        setGameID(gameID)
        let secondPlayer = {playerName: "Dávid"}
        let game = {player: secondPlayer, gameId: gameID}
        setPlayerID(2)
        axios.post("http://localhost:8080/joinnewgame", game)
        .then((response) => {
            if (response.data.gameStatus === "NOT_FOUND"){
                console.log("NOT_FOUND")
                setGameNotFound(true)
            }else{
            setNewGame(true)
            setGameNotFound(false)
            setGameID(response.data.gameId)
            }
        }
        )      
    }

    return(
    <div >
        {newGame ? <div>{false}</div>:
        <div>
        <Row justify="space-around" align="middle">
        <Col span={8}><button onClick={startNewGame}>Start new game</button></Col>
        OR
        <Col span={8}><GameIDForm connectToGame={joinGame} gameNotFound={gameNotFound}></GameIDForm></Col>
        </Row>
        <SignIn></SignIn>
        </div>
        }
        {newGame ? <PlayField gameID={gameID} playerIDForGame={playerID}></PlayField> : <div>{false}</div>}
    </div>
    )
}
export default StartGame;