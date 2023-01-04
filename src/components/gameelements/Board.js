import React, { useState } from "react";
import { Row } from "antd";
import "antd/dist/antd.css";
import BoardRow from "./BoardRow";
import PointsHeader from "./PointsHeader";
import RoseHeader from "./RoseHeader";

function Board(props) {

  return (
    <div className="board">
      <Row>
        <RoseHeader></RoseHeader>
      </Row>
      <Row>
        <PointsHeader></PointsHeader>
      </Row>
      <Row>
        <BoardRow color={"orange"} markedCells={props.orangeCells}></BoardRow>
        <BoardRow color={"red"} markedCells={props.purpleCells}></BoardRow>
        <BoardRow
          color={"turquoise"}
          markedCells={props.turquoiseCells}
        ></BoardRow>
        <BoardRow color={"black"} markedCells={props.blackCells}></BoardRow>
      </Row>
    </div>
  );
}
export default Board;
