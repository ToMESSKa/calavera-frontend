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
    const [header, setHeader] = useState([])

    useEffect(() => {
      createBoard();
    },[]);

    const createBoard = () =>{
        const orangeCell = <Col><Cell coloring="orange"></Cell></Col>
        const purpleCell = <Col><Cell coloring="purple"></Cell></Col>
        const greenCell = <Col><Cell coloring="green"></Cell></Col>
        const blackCell = <Col><Cell coloring="black"></Cell></Col>
        setBoard([createColor(orangeCell),createColor(purpleCell),createColor(greenCell),createColor(blackCell)])
        setHeader(createHeader)
      }

      const createColor = (coloredCell) =>{
        let Cells = [];
        Cells.push(coloredCell)
        for (let i = 0; i < 14; i++) {
          Cells.push(<Col><Cell></Cell></Col>);
        }
        return Cells;
        }

      const createHeader = () =>{
        let header = [];
        let headerPoints  = [4,5,6,8,10,4,0,-3]
        for (let i = 0; i < 8; i++) {
          header.push(<Col>
          {i > 4 ? <Cell coloring="grey" content={headerPoints[i]}></Cell> :
           <Cell coloring="yellow" content={headerPoints[i]}></Cell>}
          </Col>);
        }
        return header;
        }
    
    return(
    <div className="Board">
      <Row justify="end">
          {header.map((cell) => (
            cell
          ))}
      </Row>
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