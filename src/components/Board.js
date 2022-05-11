import React, {useState, useEffect } from "react";
import Cell from "./Cell";
import {Card, Space, Col, Row, Button} from "antd";
import "antd/dist/antd.css";
import { logDOM } from "@testing-library/react";


function Board () {

    const [orangeCells, setOrangeCells] = useState([]);
    const [purpleCells, setPurpleCells] = useState([]);
    const [greenCells, setGreenCells] = useState([]);
    const [blackCells, setBlackCells] = useState([]);
    const [board, setBoard] = useState([])

    useEffect(() => {
      createBoard();
    },[]);

    const createBoard = () =>{
        const orangeCell = <Col><Cell coloring="orange"></Cell></Col>
        const purpleCell = <Col><Cell coloring="purple"></Cell></Col>
        const greenCell = <Col><Cell coloring="green"></Cell></Col>
        const blackCell = <Col><Cell coloring="black"></Cell></Col>
        setBoard([createColor(orangeCell),createColor(purpleCell),createColor(greenCell),createColor(blackCell)])
        }

      const createColor = (coloredCell) =>{
        let Cells = [];
        Cells.push(coloredCell)
        for (let i = 0; i < 14; i++) {
          Cells.push(<Col><Cell></Cell></Col>);
        }
        return Cells;
        }
    
    return(
    <div className="Board">
          {board.map((color) => (
            <Row>
            {color.map((cell)  => (
              cell
            )) }
            </Row> 
        ))}
    </div>
    );
}
export default Board;