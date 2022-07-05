import Cell from "./Cell";
import {Card, Space, Col, Row, Button} from "antd";
import React, {useState, useEffect } from "react";

function BoardRow (props) {

    // useEffect(() => {
    //     createRows();
    //   },[]);

    const coloredCell = <Col><Cell content={"0"} celltype="cell" coloring="orange"></Cell></Col>

    // const createRows = (coloredCell) =>{
    //     let cells = [];
    //     cells.push(coloredCell)
    //     for (let i = 0; i < 14; i++) {
    //       cells.push(<Col>
    //       {i < 5 || i > 9 ? <Cell celltype="cell" content={markedCells[i]} coloring="#a8a3a3"></Cell> : <Cell celltype="cell"content={"X"} coloring="#e6d262"></Cell>}
    //       </Col>
    //       );
    //     }
    //     setPlayercells(cells)
    // }


    return(
        <div className="board-row">
            <Row>{props.markedCells.map((i) => (
                <Col>
                {i < 5 || i > 9 ? <Cell celltype="cell" content={i} coloring="#a8a3a3"></Cell> : <Cell celltype="cell"content={i} coloring="#e6d262"></Cell>}
                </Col>
            ))}
            </Row>
        </div>
        );
    }

export default BoardRow;