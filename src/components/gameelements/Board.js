import React, {useState} from "react";
import {Row} from "antd";
import "antd/dist/antd.css";
import BoardRow from "./BoardRow";
import PointsHeader from "./PointsHeader";
import RoseHeader from "./RoseHeader";


function Board (props) {

    let intialValue = ["","","","","","","","","","","","",""]

    const [orangeCells, setOrangeCells] = useState([intialValue]);
    const [purpleCells, setPurpleCells] = useState([intialValue]);
    const [greenCells, setGreenCells] = useState([intialValue]);
    const [blackCells, setBlackCells] = useState([intialValue]);

    return(
    <div className="board">
      <Row>
          <RoseHeader></RoseHeader>
      </Row>
      <Row>
          <PointsHeader></PointsHeader>
      </Row>
      <Row>
          <BoardRow color={"orange"} markedCells={props.markedCells}></BoardRow>
          <BoardRow color={"red"} markedCells={props.markedCells}></BoardRow>
          <BoardRow color={"turquoise"} markedCells={props.markedCells}></BoardRow>
          <BoardRow color={"black"} markedCells={props.markedCells}></BoardRow>
      </Row>
    </div>
    );
}
export default Board;