import React from "react";
import "antd/dist/antd.css";


function RerollCounter (props) {

    return(
    <div style={{visibility: props.rerollCounterVisible }}>
       This is your {props.counter} roll.
    </div>
    );
}
export default RerollCounter;