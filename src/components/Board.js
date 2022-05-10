import React, {useState, useEffect } from "react";
import Cell from "./Cell";
import {Card, Space, Col, Row, Button} from "antd";
import "antd/dist/antd.css";
import { logDOM } from "@testing-library/react";


function Board () {

    const [orangeCells, setOrangecells] = useState([]);

    useEffect(() => {
      createBoard();
    },[]);

    const createBoard = () =>{
        const orangeCell = <Col><Cell coloring="orange"></Cell></Col>
        const purpleCell = <Col><Cell coloring="purple"></Cell></Col>
        const greenCell = <Col><Cell coloring="green"></Cell></Col>
        const blackCell = <Col><Cell coloring="black"></Cell></Col>
        let orangeCells = [];
        orangeCells.push(orangeCell)
        for (let i = 0; i < 10; i++) {
          orangeCells.push(<Col><Cell></Cell></Col>);
        }
        setOrangecells(orangeCells)
        }
    
    const rows = [1,2,3,4];
    // const orangeCell = <Col><Cell coloring="orange"></Cell></Col>
    // const columns = [orangeCell,2, 3, 4, 5, 6, 7, 8, 9, 10];
    

    return(
    <div className="Board">
      {rows.map((row, rowindex) => (
        <Row>
          {orangeCells.map((column, columnindex) => (
            column     
      ))}
        </Row>
      ))}
    </div>
    );
}
export default Board;