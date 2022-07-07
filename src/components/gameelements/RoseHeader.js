import Cell from "./Cell";
import {Col, Row} from "antd";
import React, {useState} from "react";

function RoseHeader () {

    let roseHeader  = ["","","","","",4,5,6,8,10,4,0,-3]

    return(
        <div >
        <Row>
            {roseHeader.map((rose, i) => (
            <Col key={i}>
                {i === 6 ? <Cell key={i} celltype="tworosecell" coloring="yellow"></Cell>:
                i === 7 ? <Cell key={i} celltype="threerosecell" coloring="yellow"></Cell>:
                <Cell key={i} celltype="basiccell" coloring="transparent"></Cell>}
            </Col>
          ))}
        </Row>
        </div>
    );

}

export default RoseHeader;