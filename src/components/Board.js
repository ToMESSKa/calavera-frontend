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
    const [pointsHeader, setPointsHeader] = useState([])
    const [roseHeader, setRoseHeader] = useState([])

    useEffect(() => {
      createBoard();
    },[]);

    const createBoard = () =>{
        const orangeCell = <Col><Cell celltype="cell" coloring="orange"></Cell></Col>
        const purpleCell = <Col><Cell celltype="cell" coloring="purple"></Cell></Col>
        const greenCell = <Col><Cell celltype="cell" coloring="green"></Cell></Col>
        const blackCell = <Col><Cell celltype="cell" coloring="black"></Cell></Col>
        setBoard([createRows(orangeCell),createRows(purpleCell),createRows(greenCell),createRows(blackCell)])
        setPointsHeader(createPointsHeader)
        setRoseHeader(createRoseHeader)
      }

      const createRows = (coloredCell) =>{
        let Cells = [];
        Cells.push(coloredCell)
        for (let i = 0; i < 14; i++) {
          Cells.push(<Col>
          {i < 6 || i > 10 ? <Cell celltype="cell" coloring="#a8a3a3"></Cell> : <Cell celltype="cell" coloring="#e6d262"></Cell>}
          </Col>
          );
        }
        return Cells;
        }

    const createPointsHeader = () =>{
      let pointsHeader = [];
      let headerPoints  = [4,5,6,8,10,4,0,-3]
      for (let i = 0; i < 8; i++) {
        pointsHeader.push(<Col>
        {i > 4 ? <Cell celltype="cell" coloring="grey" content={headerPoints[i]}></Cell> :
          <Cell celltype="cell" coloring="yellow" content={headerPoints[i]}></Cell>}
        </Col>);
      }
      return pointsHeader;
      }

    const createRoseHeader = () =>{
      let roseHeader = [];
      for (let i = 0; i < 10; i++) {
      roseHeader.push(i === 7 ? <Cell celltype="threerosecell" coloring="yellow"></Cell>:
      i === 8 ? <Cell celltype="tworosecell" coloring="yellow"></Cell>:
      <Cell celltype="cell" coloring="transparent"></Cell>
      )}
      return roseHeader;
      }
    
    return(
    <div className="Board">
      <Row>
          {roseHeader.map((cell) => (
            cell
          ))}
      </Row>
      <Row justify="end">
          {pointsHeader.map((cell) => (
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