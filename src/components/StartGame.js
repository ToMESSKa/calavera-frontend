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
    const [firtsPlayer, setFirstPlayer] = useState(false);
    const [actualPlayer, setActualPlayer] = useState(false);


    const startNewGame = () => {
        setNewGame(true)
        let firtsPlayer = {playerName: "Player1"};
        axios.post("http://localhost:8080/startnewgame", firtsPlayer)
        .then((response) => {
            console.log(response.data.gameId);
            setGameID(response.data.gameId);
            setActualPlayer("first")
        })      
    }

    const joinGame = (e) =>{
        let gameID = parseInt(e.current.value)
        setGameID(gameID)
        let secondPlayer = {playerName: "Dávid"}
        let game = {player: secondPlayer, gameId: gameID}
        console.log("hu")
        axios.post("http://localhost:8080/joinnewgame", game)
        .then((response) => {
            console.log(response.data)
            if (response.data.gameStatus === "NOT_FOUND"){
                console.log("NOT_FOUND")
                setGameNotFound(true)
            }else{
            setNewGame(true)
            setGameNotFound(false)
            setGameID(response.data.gameId)
            setActualPlayer("second")
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
        {newGame ? <PlayField gameID={gameID} actualPlayer={actualPlayer}></PlayField> : <div>{false}</div>}
    </div>
    )
}
export default StartGame;