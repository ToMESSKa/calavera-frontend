import {useRef, useEffect} from 'react';
import { Card, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { getElementError } from "@testing-library/react";


function SignIn (props) {

    return(
    <div className="sign-in">
        <Row align="middle" justify="center">
        <Col span={4}><button> Sign In </button></Col>
        <Col span={4}><button> Register </button></Col>
        </Row>
    </div>
    );
}
export default SignIn;