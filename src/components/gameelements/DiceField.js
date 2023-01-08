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
      { diceNumber: "dice1", diceColor: 1 },
      { diceNumber: "dice2", diceColor: 2 },
      { diceNumber: "dice3", diceColor: 3 },
      { diceNumber: "dice4", diceColor: 4 },
      { diceNumber: "dice5", diceColor: 5 },
      { diceNumber: "dice6", diceColor: 6 },
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
  const [dicesGroupedByColor, setGroupedDiceRolls] = useState([]);
  const [sortedDiceByColor, setSortedDiceByColor] = useState({
    purple: [],
    black: [],
    orange: [],
    rose: [],
    skull: [],
    turquoise: [],
  });
  const [dicesVisible, setDicesVisible] = useState(true);
  const [rollingIsOver, setRollingIsOver] = useState(false);
  const [diceActionAfterRoll, setDiceActionAfterRoll] = useState();
  const [stopButtonVisible, setStopButtonVisible] = useState(false);
  const [selectedDiceForReroll, setSelectedDiceForReroll] = useState([]);
  const [rerollButtonVisible, setRerollButtonVisible] = useState(false);
  const [numberOfRerolledDice, setNumberOfRerolledDice] = useState(6);
  const [orangeCellsToMark, setOrangeCellsToMark] = useState(0);
  const [purpleCellsToMark, setRedCellsToMark] = useState(0);
  const [turquoiseCellsToMark, setTurquoiseCellsToMark] = useState(0);
  const [blackCellsToMark, setBlackCellsToMark] = useState(0);
  const [playerToMarkCells, setPlayerToMarkCells] = useState(1);
  const [mainPlayerTurnIsOver, setMainPlayerTurnIsOver] = useState(false);
  const [isTurnOver, setTurnOver] = useState(false);
  const faces = [purple, black, orange, rose, skull, turquoise];
  let counter = 0;

  useEffect(() => {
    if (cheatValues !== 0) {
      rollAllDicesForTheOtherPlayer();
    }
  }, [cheatValues]);

  useEffect(() => {
    if (props.rollButtonHidden === true) {
      setDicesVisible(false);
    }
  }, []);

  const stompClient = useStompClient();

  useSubscription("/topic/getdicerollresult", (message) => {

    if (props.actualPlayer === 2) {
      setRollsForTheOtherPlayer(JSON.parse(message.body).diceRolls);
      setTimeout(function () {
        groupForTheOtherPlayer(JSON.parse(message.body).diceRolls);
      }, 1500);
    }
  });

  useSubscription("/topic/getseledteddicererollresult", (message) => {
    if (props.actualPlayer === 2) {
      selectForReroll(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getcanceleddice", (message) => {
    if (props.actualPlayer === 2) {
      cancelForReroll(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getnewdiceforroll", (message) => {
    if (props.actualPlayer === 2) {
      prepareForReRoll();
    }
  });

  useSubscription("/topic/getselectedcolor", (message) => {
    if (props.actualPlayer === 2) {
      selectDiceColorToMarkCells(JSON.parse(message.body).diceColor);
    } else if (props.actualPlayer === 1) {
      selectDiceColorToMarkCells(JSON.parse(message.body).diceColor);
    }
  });

  useSubscription("/topic/getmarkedcells", (message) => {
    if (props.actualPlayer === 2 && playerToMarkCells === 1) {
      markCells(
        JSON.parse(message.body).numberOfDice,
        JSON.parse(message.body).value
      );
    } else if (props.actualPlayer === 1 && playerToMarkCells === 2) {
      markCells(
        JSON.parse(message.body).numberOfDice,
        JSON.parse(message.body).value
      );
    } else if (props.actualPlayer === 1) {
      setPlayerToMarkCells(2);
    } else if (props.actualPlayer === 2) {
      setPlayerToMarkCells(2);
    }
  });

  useSubscription("/topic/getwhoseturnitis", (message) => {
    if (props.actualPlayer === 2) {
      setPlayerToMarkCells(2);
    }
  });

  useSubscription("/topic/turnisover", (message) => {
    startNewTurn();
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

  const sendMarkedCells = (markedCells) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/markedcells",
        body: JSON.stringify(markedCells),
      });
    } else {
      //Handle error
    }
  };

  const sendWhoseTurnItIs = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/whoseturnitis",
        body: JSON.stringify({ whoseTurnItIs: playerToMarkCells }),
      });
    } else {
      //Handle error
    }
  };

  const notifyServerAboutTheEndOfTurn = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/turnisover",
        body: JSON.stringify({ turnIsOver: true }),
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
    if (props.actualPlayer === 1) {
      for (let dice of diceRolls.diceRolls) {
        if (dice.diceNumber === number) {
          dice.diceColor = value;
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

  const convertDiceValueToColor = (diceValue) => {
    switch (diceValue) {
      case 1:
        return 1;
      case 2:
        return 1;
      case 3:
        return 1;
      case 4:
        return 1;
      case 5:
        return 1;
      default:
        return 1;
    }
  };

  const setRollsForTheOtherPlayer = (rolls) => {
    let values = [];
    for (let i = 0; i < rolls.length; i++) {
      values.push(rolls[i].diceColor);
    }
    setCheatValues(values);
  };

  const groupForTheOtherPlayer = (rolls) => {
    if (props.actualPlayer === 2) {
      groupDiceRolls(rolls);
    }
  };

  const handleClickOnDice = (value) => {
    console.log(playerToMarkCells)
    if (rollingIsOver && playerToMarkCells === props.actualPlayer) {
      selectDiceColorToMarkCells(value);
      sendWhoseTurnItIs();
    } else if (playerToMarkCells === props.actualPlayer) {
      otherPlayerChosesFromTheRestofDice(value);
    } else {
      selectForReroll(value);
    }
  };

  const selectForReroll = (value) => {
    if (props.rerollCounter !== "third") {
      let isFound = false;
      if (value !== 5) {
        for (let group of dicesGroupedByColor) {
          if (isFound) {
            break;
          }
          for (let dice of group) {
            if (dice.diceValue === value) {
              group.pop();
              selectedDiceForReroll.push(dice);
              setSelectedDiceForReroll([...selectedDiceForReroll]);
              isFound = true;
              if (props.actualPlayer === 1) {
                sendSelectedRerolldice(dice);
              }
              break;
            }
          }
        }
        setGroupedDiceRolls([...dicesGroupedByColor]);
        if (selectedDiceForReroll !== [] && props.actualPlayer === 1) {
          setRerollButtonVisible(true);
        }
        setStopButtonVisible(false);
      }
    }
  };

  const cancelForReroll = (value) => {
    let isFound = false;
    for (let group of dicesGroupedByColor) {
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
      dicesGroupedByColor.push([{ diceNumber: "example", diceValue: value }]);
    }
    for (let dice of selectedDiceForReroll) {
      if (dice.diceValue === value) {
        selectedDiceForReroll.splice(selectedDiceForReroll.indexOf(dice), 1);
        if (props.actualPlayer === 1) {
          sendCanceledDice(dice);
        }
        break;
      }
    }
    setSelectedDiceForReroll([...selectedDiceForReroll]);
    setGroupedDiceRolls([...dicesGroupedByColor]);
    if (selectedDiceForReroll.length === 0) {
      setRerollButtonVisible(false);
      setStopButtonVisible(true);
    }
  };

  const groupDiceRolls = (rolls) => {
    for (let dice of rolls) {
      if (dice.diceColor === 1) {
        sortedDiceByColor.purple.push(dice);
      } else if (dice.diceColor === 2) {
        sortedDiceByColor.black.push(dice);
      } else if (dice.diceColor === 3) {
        sortedDiceByColor.orange.push(dice);
      } else if (dice.diceColor === 4) {
        sortedDiceByColor.rose.push(dice);
      } else if (dice.diceColor === 5) {
        sortedDiceByColor.skull.push(dice);
      } else if (dice.diceColor === 6) {
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
    setDiceRolls({ diceRolls: selectedDiceForReroll });
    setSelectedDiceForReroll([]);
    setNumberOfRerolledDice(selectedDiceForReroll.length);
    setDicesVisible(true);
    setRerollButtonVisible(false);
    if (props.actualPlayer === 1) {
      sendNewDiceForRoll({ diceRolls: selectedDiceForReroll });
    }
    if (props.rerollCounter === 1) {
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

  const endRollingPhase = (value) => {
    setPlayerToMarkCells(props.actualPlayer);
    setRollingIsOver(true);
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
    if (props.actualPlayer === 1 && playerToMarkCells === 1) {
      selectPlayer(value, 1, cells);
    } else if (props.actualPlayer === 1 && playerToMarkCells === 2) {
      selectPlayer(value, 2, cells);
    } else if (props.actualPlayer === 2 && playerToMarkCells === 1) {
      selectPlayer(value, 1, cells);
    } else if (props.actualPlayer === 2 && playerToMarkCells === 2) {
      selectPlayer(value, 2, cells);
    }
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

  const selectDiceColorToMarkCells = (selectedDiceColor) => {
    sendSelectedColor(props.actualPlayer);
    let isSelectedColorFound = false;
    for (let group of dicesGroupedByColor) {
      if (group[0].diceColor === selectedDiceColor) {
        let indexOfGroup = dicesGroupedByColor.indexOf(group);
        dicesGroupedByColor.splice(indexOfGroup, 1);
        isSelectedColorFound = true;
        if (props.actualPlayer === 1) {
          sendSelectedColor(group[0], selectedDiceColor);
          markCells(group.length, selectedDiceColor);
          let markedCells = {
            numberOfDice: group.length,
            value: selectedDiceColor,
          };
          sendMarkedCells(markedCells);
        } else if (props.actualPlayer === 2) {
          sendSelectedColor(group[0], selectedDiceColor);
          markCells(group.length, selectedDiceColor);
          let markedCells = {
            numberOfDice: group.length,
            value: selectedDiceColor,
          };
          sendMarkedCells(markedCells);
        }
        break;
      }
      if (isSelectedColorFound) {
        break;
      }
    }
    setGroupedDiceRolls([...dicesGroupedByColor]);
  };

  const otherPlayerChosesFromTheRestofDice = (value) => {
    selectDiceColorToMarkCells(value);
    notifyServerAboutTheEndOfTurn();
  };

  const startNewTurn = () => {
    setDiceRolls(defaultDiceRolls);
    setDicesVisible(true);
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
            groupedDiceRolls={dicesGroupedByColor}
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
            <button onClick={endRollingPhase}>STOP</button>
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
