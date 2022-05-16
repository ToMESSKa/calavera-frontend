import React from "react";
import { Card } from 'antd';


function Cell (props) {

    return(
    <div className={props.celltype} style={{background:props.coloring}}>
        <p className="content">{props.content}</p>
    </div>
    );
}
export default Cell;