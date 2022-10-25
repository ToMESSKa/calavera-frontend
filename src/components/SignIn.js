import {useRef, useEffect} from 'react';
import { Card, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { getElementError } from "@testing-library/react";
import SockJS from "sockjs-client";
import StompJs from "stompjs";

import {
    StompSessionProvider,
    useStompClient,
    useSubscription,
    withStompClient,
    withSubscription
  } from "react-stomp-hooks";



function SignIn (props) {

    const defaultDiceRolls = 
    {diceRolls:[
        {diceNumber:"dice1", diceValue:1},
        {diceNumber:"dice2", diceValue:1},
        {diceNumber:"dice3", diceValue:1},
        {diceNumber:"dice4", diceValue:1}, 
        {diceNumber:"dice5", diceValue:1},
        {diceNumber:"dice6", diceValue:1}
    ]}


    const stompClient = useStompClient();
    useSubscription("/topic/getdicerollresult", (message) => console.log(JSON.parse(message.body)));

    const sendMessage = () => {
        if(stompClient) {
         //Send Message
        stompClient.publish({
            destination: '/app/rolldice',
            body: JSON.stringify(defaultDiceRolls)
        });
        }
            else {
        //Handle error
        }   
    };

  

    return(
    <div className="sign-in">
        <Row align="middle" justify="center">
        <Col span={4}><button> Sign In </button></Col>
        <Col span={4}><button onClick={sendMessage}> Register </button></Col>
        </Row>
    </div>
    );
}
export default SignIn;