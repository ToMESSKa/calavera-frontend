import { Col, Row } from "antd";
import { React, useRef, useState, useEffect } from "react";
import purple from "../../static/purple.jpg";
import black from "../../static/black.jpg";
import turquoise from "../../static/turquoise.jpg";
import orange from "../../static/orange.jpg";
import skull from "../../static/skull.jpg";
import rose from "../../static/rose.jpg";
import DiceGroupingField from "./DiceGroupingField";
import RerollSelectionField from "./RerollSelectionField";
import DiceRollingField from "./DiceRollingField";
import { useStompClient, useSubscription } from "react-stomp-hooks";

function DiceField(props) {
  const defaultDiceRolls = {
    diceRolls: [
      { diceNumber: "dice1", diceValue: 1 },
      { diceNumber: "dice2", diceValue: 1 },
      { diceNumber: "dice3", diceValue: 1 },
      { diceNumber: "dice4", diceValue: 1 },
      { diceNumber: "dice5", diceValue: 1 },
      { diceNumber: "dice6", diceValue: 1 },
    ],
  };

  const allDice = useRef();
  const myDice1 = useRef();
  const myDice2 = useRef();
  const myDice3 = useRef();
  const myDice4 = useRef();
  const myDice5 = useRef();
  const myDice6 = useRef();
  const myDice = useRef();
  const [testDice, setTestDice] = useState([
    myDice1,
    myDice2,
    myDice3,
    myDice4,
    myDice5,
    myDice6,
  ]);
  const myButton = useRef();
  const [cheatValues, setCheatValues] = useState(0);
  const [diceRolls, setDiceRolls] = useState(defaultDiceRolls);
  const [groupedDiceRolls, setGroupedDiceRolls] = useState([]);
  const [sortedDiceByColor, setSortedDiceByColor] = useState({
    purple: [],
    black: [],
    orange: [],
    rose: [],
    skull: [],
    turquoise: [],
  });
  const [dicesVisible, setDicesVisible] = useState(true);
  const [selectedDiceForReroll, setSelectedDiceForReroll] = useState([]);
  const [rerollButtonVisible, setRerollButtonVisible] = useState(false);
  const [numberOfRerolledDice, setNumberOfRerolledDice] = useState(6);
  const faces = [purple, black, orange, rose, skull, turquoise];
  let counter = 0;

  useEffect(() => {
    if (cheatValues !== 0) {
      rollAllDicesForTheOtherPlayer();
    }
  }, [cheatValues]);

  const stompClient = useStompClient();

  useSubscription("/topic/getdicerollresult", (message) => {
    if (props.actualPlayer === "second") {
      setRollsForTheOtherPlayer(JSON.parse(message.body).diceRolls);
      setTimeout(function () {
        groupForTheOtherPlayer(JSON.parse(message.body).diceRolls);
      }, 1500);
    }
  });

  useSubscription("/topic/getdicererollresult", (message) => {
    if (props.actualPlayer === "second") {
      selectForReroll(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getcanceleddice", (message) => {
    if (props.actualPlayer === "second") {
      cancelForReroll(JSON.parse(message.body).diceValue);
    }
  });

  const sendDiceResults = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/rolldice",
        body: JSON.stringify(diceRolls),
      });
    } else {
      //Handle error
    }
    groupDiceRolls(diceRolls.diceRolls);
  };

  const sendRerollResults = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/rerolldice",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const sendCanceledDice = (dice) => {
    console.log("send");
    if (stompClient) {
      stompClient.publish({
        destination: "/app/canceldice",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const rollAllDices = (e) => {
    for (let dice of testDice) {
      dice.current.rollDice();
    }
  };

  const rollAllDicesForTheOtherPlayer = (e) => {
    for (let dice of testDice) {
      dice.current.rollDice();
    }
  };

  const getDiceValue = (value, number) => {
    if (props.actualPlayer === "first") {
      for (let dice of diceRolls.diceRolls) {
        if (dice.diceNumber === number) {
          dice.diceValue = value;
        }
      }
      counter = counter + 1;
      if (counter === numberOfRerolledDice) {
        sendDiceResults();
        counter = 0;
      }
      setDiceRolls(diceRolls);
    }
  };

  const setRollsForTheOtherPlayer = (rolls) => {
    let values = [
      rolls[0].diceValue,
      rolls[1].diceValue,
      rolls[2].diceValue,
      rolls[3].diceValue,
      rolls[4].diceValue,
      rolls[5].diceValue,
    ];
    setCheatValues(values);
  };

  const groupForTheOtherPlayer = (rolls) => {
    if (props.actualPlayer === "second") {
      groupDiceRolls(rolls);
    }
  };

  const selectForReroll = (value) => {
    let isFound = false;
    if (value !== 5) {
      for (let group of groupedDiceRolls) {
        if (isFound) {
          break;
        }
        for (let dice of group) {
          if (dice.diceValue === value) {
            group.pop();
            selectedDiceForReroll.push(dice);
            setSelectedDiceForReroll([...selectedDiceForReroll]);
            isFound = true;
            if (props.actualPlayer === "first") {
              sendRerollResults(dice);
            }
            break;
          }
        }
      }
      setGroupedDiceRolls([...groupedDiceRolls]);
      if (selectedDiceForReroll !== []) {
        setRerollButtonVisible(true);
      }
    }
  };

  const cancelForReroll = (value) => {
    let isFound = false;
    for (let group of groupedDiceRolls) {
      if (isFound) {
        break;
      }
      for (let dice of group) {
        if (dice.diceValue === value) {
          group.push(dice);
          isFound = true;
          break;
        }
      }
    }
    if (!isFound) {
      groupedDiceRolls.push([{ diceNumber: "example", diceValue: value }]);
    }
    for (let dice of selectedDiceForReroll) {
      if (dice.diceValue === value) {
        selectedDiceForReroll.splice(selectedDiceForReroll.indexOf(dice), 1);
        if (props.actualPlayer === "first") {
          console.log("fuck");
          sendCanceledDice(dice);
        }
        break;
      }
    }
    setSelectedDiceForReroll([...selectedDiceForReroll]);
    setGroupedDiceRolls([...groupedDiceRolls]);
    if (selectedDiceForReroll.length === 0) {
      setRerollButtonVisible(false);
    }
  };


  const groupDiceRolls = (rolls) => {
    for (let dice of rolls) {
      if (dice.diceValue === 1) {
        sortedDiceByColor.purple.push(dice);
      } else if (dice.diceValue === 2) {
        sortedDiceByColor.black.push(dice);
      } else if (dice.diceValue === 3) {
        sortedDiceByColor.orange.push(dice);
      } else if (dice.diceValue === 4) {
        sortedDiceByColor.rose.push(dice);
      } else if (dice.diceValue === 5) {
        sortedDiceByColor.skull.push(dice);
      } else if (dice.diceValue === 6) {
        sortedDiceByColor.turquoise.push(dice);
      }
    }
    let arr = [];
    for (const [key, value] of Object.entries(sortedDiceByColor)) {
      if (value.length !== 0) {
        arr.push(value);
      }
    }
    setSortedDiceByColor(sortedDiceByColor);
    setGroupedDiceRolls(arr);
    setDicesVisible(false);
  };

  const reRoll = (rolls) => {
    setDiceRolls({ diceRolls: selectedDiceForReroll });
    setSelectedDiceForReroll([]);
    setNumberOfRerolledDice(selectedDiceForReroll.length);
    setDicesVisible(true);
    setRerollButtonVisible(false);
  };

  return (
    <div className="dice-field">
      <Row>
        <Col>
          <DiceGroupingField
            dicesVisible={dicesVisible}
            myDice={myDice}
            cheatValues={cheatValues}
            getDiceValue={getDiceValue}
            selectForReroll={selectForReroll}
            groupedDiceRolls={groupedDiceRolls}
            faces={faces}
          ></DiceGroupingField>
        </Col>
        <Col>
          <RerollSelectionField
            reRoll={reRoll}
            selectedDiceForReroll={selectedDiceForReroll}
            cancelForReroll={cancelForReroll}
            rerollButtonVisible={rerollButtonVisible}
            faces={faces}
          ></RerollSelectionField>
        </Col>
      </Row>
      <Row>
        <Col>
          <DiceRollingField
            testDice={testDice}
            diceRolls={diceRolls}
            dicesVisible={dicesVisible}
            allDice={allDice}
            cheatValues={cheatValues}
            getDiceValue={getDiceValue}
            faces={faces}
          ></DiceRollingField>
        </Col>
      </Row>
      <Row>
        {dicesVisible ? (
          <button ref={myButton} onClick={rollAllDices}>
            Roll
          </button>
        ) : (
          <div>{false}</div>
        )}
      </Row>
    </div>
  );
}

export default DiceField;
