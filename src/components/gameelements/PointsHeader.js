import Cell from "./Cell";
import {Col, Row} from "antd";
import React from "react";

function PointsHeader () {

    let headerPoints  = ["","","","","",4,5,6,8,10,4,0,-3]

    return(
        <div >
        <Row>
            {headerPoints.map((point, i) => (
            <Col key={i}>
                {i > 5 && i < 11 ? <Cell key={i} celltype="basiccell" coloring="yellow" content={point}></Cell>:
                i > 10 && i < 14 ? <Cell key={i} celltype="basiccell" coloring="grey" content={point}></Cell>:
                <Cell key={i} celltype="basiccell" coloring="transparent"></Cell>}
            </Col>
          ))}
        </Row>
        </div>
    );

}

export default PointsHeader;