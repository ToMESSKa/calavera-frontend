import React from "react";
import { Card } from 'antd';


function Cell (props) {

    return(
    <div className="cell" style={{background:props.coloring}}>
        <p>{props.content}</p>
    </div>
    );
}
export default Cell;