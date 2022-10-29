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

  const myDice1 = useRef();
  const myDice2 = useRef();
  const myDice3 = useRef();
  const myDice4 = useRef();
  const myDice5 = useRef();
  const myDice6 = useRef();
  const myDice = useRef();
  const [allDiceToRoll, setAllDiceToRoll] = useState([
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
  const [turnOver, setTurnOver] = useState(false);
  const [diceActionAfterRoll, setDiceActionAfterRoll] = useState();
  const [stopButtonVisible, setStopButtonVisible] = useState(false);
  const [selectedDiceForReroll, setSelectedDiceForReroll] = useState([]);
  const [rerollButtonVisible, setRerollButtonVisible] = useState(false);
  const [numberOfRerolledDice, setNumberOfRerolledDice] = useState(6);
  const [orangeCellsToMark, setOrangeCellsToMark] = useState(0);
  const [purpleCellsToMark, setRedCellsToMark] = useState(0);
  const [turquoiseCellsToMark, setTurquoiseCellsToMark] = useState(0);
  const [blackCellsToMark, setBlackCellsToMark] = useState(0);
  const [whosTurnItIs, setWhosTurnItIs] = useState(1);
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

  useSubscription("/topic/getseledteddicererollresult", (message) => {
    if (props.actualPlayer === "second") {
      selectForReroll(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getcanceleddice", (message) => {
    if (props.actualPlayer === "second") {
      cancelForReroll(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getnewdiceforroll", (message) => {
    if (props.actualPlayer === "second") {
      prepareForReRoll();
    }
  });

  useSubscription("/topic/getselectedcolor", (message) => {
    if (props.actualPlayer === "second") {
      selectColor(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getmarkedcells", (message) => {
    if (props.actualPlayer === "second") {
      markCells(JSON.parse(message.body).numberOfDice,JSON.parse(message.body).value)
      console.log(message)
    }
  });


  const sendRollResults = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/rolleddice",
        body: JSON.stringify(diceRolls),
      });
    } else {
      //Handle error
    }
    groupDiceRolls(diceRolls.diceRolls);
  };

  const sendSelectedRerolldice = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/selectedrerolldice",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const sendCanceledDice = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/canceleddice",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const sendNewDiceForRoll = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/newdiceforroll",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const sendSelectedColor = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/selectedcolor",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const sendMarkedCells= (markedCells) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/markedcells",
        body: JSON.stringify(markedCells),
      });
    } else {
      //Handle error
    }
  };

  const rollAllDices = (e) => {
    for (let dice of allDiceToRoll) {
      dice.current.rollDice();
    }
  };

  const rollAllDicesForTheOtherPlayer = (e) => {
    for (let dice of allDiceToRoll) {
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
        sendRollResults();
        counter = 0;
      }
      setDiceRolls(diceRolls);
    }
  };

  const setRollsForTheOtherPlayer = (rolls) => {
    let values = [];
    for (let i = 0; i < rolls.length; i++) {
      values.push(rolls[i].diceValue);
    }
    setCheatValues(values);
  };

  const groupForTheOtherPlayer = (rolls) => {
    if (props.actualPlayer === "second") {
      groupDiceRolls(rolls);
    }
  };

  const handleClickOnDice = (value) => {
    if (turnOver) {
      selectColor(value);
    } else {
      selectForReroll(value);
    }
  };

  const selectForReroll = (value) => {
    if (props.rerollCounter !== "third") {
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
                sendSelectedRerolldice(dice);
              }
              break;
            }
          }
        }
        setGroupedDiceRolls([...groupedDiceRolls]);
        if (selectedDiceForReroll !== [] && props.actualPlayer === "first") {
          setRerollButtonVisible(true);
        }
        setStopButtonVisible(false);
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
          sendCanceledDice(dice);
        }
        break;
      }
    }
    setSelectedDiceForReroll([...selectedDiceForReroll]);
    setGroupedDiceRolls([...groupedDiceRolls]);
    if (selectedDiceForReroll.length === 0) {
      setRerollButtonVisible(false);
      setStopButtonVisible(true);
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
    setStopButtonVisible(true);
  };

  const prepareForReRoll = () => {
    console.log(selectedDiceForReroll);
    setDiceRolls({ diceRolls: selectedDiceForReroll });
    setSelectedDiceForReroll([]);
    setNumberOfRerolledDice(selectedDiceForReroll.length);
    setDicesVisible(true);
    setRerollButtonVisible(false);
    if (props.actualPlayer === "first") {
      sendNewDiceForRoll({ diceRolls: selectedDiceForReroll });
    }
    if (props.rerollCounter === "first") {
      props.setRerollCounter("second");
    } else if (props.rerollCounter === "second") {
      props.setRerollCounter("third");
    }
    let newAllDiceToRoll = [];
    for (let i = 0; i < selectedDiceForReroll.length; i++) {
      newAllDiceToRoll.push(allDiceToRoll[i]);
    }
    setAllDiceToRoll(newAllDiceToRoll);
    setDiceActionAfterRoll(selectForReroll);
  };

  const endTurn = (value) => {
    setTurnOver(true);
  };

  const markCells = (numberOfDice, value) => {
    let cells = [];
    let cellsToMark = defineColor(value);
    for (let i = 0; i < 13; i++) {
      if (i < cellsToMark + numberOfDice) {
        cells.push("X");
      } else {
        cells.push("");
      }
    }
    selectPlayer(value, whosTurnItIs, cells);
  };

  const defineColor = (value) => {
    if (value === 1) {
      return purpleCellsToMark;
    } else if (value === 2) {
      return blackCellsToMark;
    } else if (value === 3) {
      return orangeCellsToMark;
    } else if (value === 6) {
      return turquoiseCellsToMark;
    }
  };

  const selectPlayer = (value, player, cells) => {
    if (player === 1 && value === 1) {
      props.setPlayerOnePurpleCells(cells);
    } else if (player === 1 && value === 2) {
      props.setPlayerOneBlackCells(cells);
    } else if (player === 1 && value === 3) {
      props.setPlayerOneOrangeCells(cells);
    } else if (player === 1 && value === 6) {
      props.setPlayerOneTurquoiseCells(cells);
    } else if (player === 2 && value === 1) {
      props.setPlayerTwoPurpleCells(cells);
    } else if (player === 2 && value === 2) {
      props.setPlayerTwoBlackCells(cells);
    } else if (player === 2 && value === 3) {
      props.setPlayerTwoOrangeCells(cells);
    } else if (player === 2 && value === 6) {
      props.setPlayerTwoTurquoiseCells(cells);
    }
  };

  const selectColor = (value) => {
    let isFound = false;
    for (let group of groupedDiceRolls) {
      if (group[0].diceValue === value) {
        let indexOfGroup = groupedDiceRolls.indexOf(group);
        groupedDiceRolls.splice(indexOfGroup, 1);
        isFound = true;
        if (props.actualPlayer === "first") {
          sendSelectedColor(group[0], value);
        }
        markCells(group.length, value);
        if (props.actualPlayer === "first"){
        let markedCells = {numberOfDice: group.length, value: value}
        sendMarkedCells(markedCells)
        }
        break;
      }
      if (isFound) {
        break;
      }
    }
    setGroupedDiceRolls([...groupedDiceRolls]);
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
            handleClickOnDice={handleClickOnDice}
            groupedDiceRolls={groupedDiceRolls}
            faces={faces}
          ></DiceGroupingField>
        </Col>
        <Col>
          <RerollSelectionField
            reRoll={prepareForReRoll}
            selectedDiceForReroll={selectedDiceForReroll}
            cancelForReroll={cancelForReroll}
            rerollButtonVisible={rerollButtonVisible}
            faces={faces}
          ></RerollSelectionField>
        </Col>
        <Col>
          {stopButtonVisible ? (
            <button onClick={endTurn}>STOP</button>
          ) : (
            <div></div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <DiceRollingField
            allDiceToRoll={allDiceToRoll}
            diceRolls={diceRolls}
            dicesVisible={dicesVisible}
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
