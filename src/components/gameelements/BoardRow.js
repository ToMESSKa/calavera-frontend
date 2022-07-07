import Cell from "./Cell";
import {Col, Row} from "antd";
import React from "react";

function BoardRow (props) {

    return(
        <div className="board-row">
        <Col>
            <Row>
                <Col><Cell celltype="basiccell" coloring={props.color}></Cell></Col>
                {props.markedCells.map((markedCell, i) => (
                <Col key={i}>
                {i < 5 || i > 9 ? <Cell key={i} celltype="basiccell" content={markedCell} coloring="#a8a3a3"></Cell> : <Cell key={i} celltype="basiccell" content={markedCell} coloring="#e6d262"></Cell>}
                </Col>
            ))}
            </Row>
        </Col>
        </div>
        );
    }

export default BoardRow;