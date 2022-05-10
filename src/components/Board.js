import React, {useState, useEffect } from "react";
import Cell from "./Cell";
import {Card, Space, Col, Row, Button} from "antd";
import "antd/dist/antd.css";


function Board () {

    const [orangeCells, setOrangecells] = useState([]);

    const createBoard = () =>{
        setOrangecells([1,2,3,4])
        }
    
    const rows = [1,2,3,4];
    const columns = [1,2, 3, 4, 5, 6, 7, 8, 9, 10];

    return(
    <div className="Board">
      {rows.map((row, rowindex) => (
        <Row>
          {columns.map((column, columnindex) => (
        <Col><Cell></Cell></Col>
      ))}
        </Row>
      ))}
    </div>
    );
}
export default Board;