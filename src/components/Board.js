import React, {useState, useEffect } from "react";
import Cell from "./Cell";
import {Card, Space, Col, Row, Button} from "antd";


function Board () {

    const [orangeCells, setOrangecells] = useState([]);

    const createBoard = () =>{
        setOrangecells([1,2,3,4])
        }

    return(
    <div className="Board">
      <header className="Board-header">
          <button onClick={(event) => {
              createBoard(event);
            }}>CLICK HERE</button>
          <Row>
          {orangeCells.map((orangeCell, i) => <Col><Cell></Cell></Col>)}
          </Row>
      </header>
    </div>
    );
}
export default Board;