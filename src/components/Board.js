import React, {useState, useEffect } from "react";
import Cell from "./Cell";
import {Card, Space, Col, Row, Button} from "antd";
import "antd/dist/antd.css";
import axios from "axios";

function Board () {

    const [orangeCells, setOrangeCells] = useState([]);
    const [purpleCells, setPurpleCells] = useState([]);
    const [greenCells, setGreenCells] = useState([]);
    const [blackCells, setBlackCells] = useState([]);
    const [playercells, setPlayercells] = useState([])
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
        setPlayercells([createRows(orangeCell),createRows(purpleCell),createRows(greenCell),createRows(blackCell)])
        setPointsHeader(createPointsHeader)
        setRoseHeader(createRoseHeader)
      }

      const createRows = (coloredCell) =>{
        let cells = [];
        cells.push(coloredCell)
        for (let i = 0; i < 14; i++) {
          cells.push(<Col>
          {i < 5 || i > 9 ? <Cell celltype="cell" coloring="#a8a3a3"></Cell> : <Cell celltype="cell" coloring="#e6d262"></Cell>}
          </Col>
          );
        }
        return cells;
        }

    const createPointsHeader = () =>{
      let pointsHeader = [];
      let headerPoints  = [4,5,6,8,10,4,0,-3]
      for (let i = 0; i < 15; i++) {
        pointsHeader.push(<Col>
        {i > 5 && i < 11 ? <Cell celltype="cell" coloring="yellow" content={headerPoints[i-6]}></Cell> :
        i > 10 && i < 14 ? <Cell celltype="cell" coloring="grey" content={headerPoints[i-6]}></Cell>:
          <Cell celltype="cell" coloring="transparent"></Cell>}
        </Col>);
      }
      return pointsHeader;
      }

    const createRoseHeader = () =>{
      let roseHeader = [];
      for (let i = 0; i < 13; i++) {
      roseHeader.push(i === 6 ? <Cell celltype="tworosecell" coloring="yellow"></Cell>:
      i === 7 ? <Cell celltype="threerosecell" coloring="yellow"></Cell>:
      <Cell celltype="cell" coloring="transparent"></Cell>
      )}
      return roseHeader;
      }
    
    return(
    <div className="board">
      <Row>
          {roseHeader.map((cell) => (
            cell
          ))}
      </Row>
      <Row>
          {pointsHeader.map((cell) => (
            cell
          ))}
      </Row>
      <Row>
          {playercells.map((color) => (
            <Row>
                {color.map((cell)  => (
                    cell
            ))}
            </Row>
          ))}
      </Row>
    </div>
    );
}
export default Board;