import Cell from "./Cell";
import {Col, Row} from "antd";
import React from "react";

function BoardRow (props) {

    return(
        <div className="board-row">
            <Row>
                <Col><Cell celltype="basiccell" coloring={props.color}></Cell></Col>
                {props.markedCells.map((i) => (
                <Col>
                {i < 5 || i > 9 ? <Cell celltype="basiccell" content={i} coloring="#a8a3a3"></Cell> : <Cell celltype="basiccell" content={i} coloring="#e6d262"></Cell>}
                </Col>
            ))}
            </Row>
        </div>
        );
    }

export default BoardRow;