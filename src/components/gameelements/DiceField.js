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
  const defaultDicesToBeRolled = {
    diceRolls: [
      { diceNumber: "dice1", diceColor: 1 },
      { diceNumber: "dice2", diceColor: 2 },
      { diceNumber: "dice3", diceColor: 3 },
      { diceNumber: "dice4", diceColor: 4 },
      { diceNumber: "dice5", diceColor: 5 },
      { diceNumber: "dice6", diceColor: 6 },
    ],
  };
  let defaultDicesGroupedByColor = {
    purple: [],
    black: [],
    orange: [],
    rose: [],
    skull: [],
    turquoise: [],
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
  const [presetColorForRollResult, setPresetColorForRollResult] = useState(0);
  const [dicesToBeRolled, setDicesToBeRolled] = useState(
    defaultDicesToBeRolled
  );
  const [diceRollResults, setDiceRollResults] = useState({ diceRolls: [] });
  const [dicesGroupedByColor, setDicesGroupedByColor] = useState({
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
  const [selectedDicesForReroll, setSelectedDicesForReroll] = useState({
    purple: [],
    black: [],
    orange: [],
    rose: [],
    skull: [],
    turquoise: [],
  });
  const [rerollButtonVisible, setRerollButtonVisible] = useState(false);
  const [numberOfRolledDices, setNumberOfRolledDices] = useState(6);
  const [orangeCellsToMark, setOrangeCellsToMark] = useState(0);
  const [purpleCellsToMark, setRedCellsToMark] = useState(0);
  const [turquoiseCellsToMark, setTurquoiseCellsToMark] = useState(0);
  const [blackCellsToMark, setBlackCellsToMark] = useState(0);
  const [playerToMarkCells, setPlayerToMarkCells] = useState(1);
  const [mainPlayerTurnIsOver, setMainPlayerTurnIsOver] = useState(false);
  const [isTurnOver, setTurnOver] = useState(false);
  const faces = [purple, black, orange, rose, skull, turquoise];
  let counter = 0;
  let selectedDiceColorToMarkCellIsSent = false;

  useEffect(() => {
    if (
      props.playerIDForGame !== playerToMarkCells &&
      presetColorForRollResult !== 0
    ) {
      rollAllDices();
    }
  }, [presetColorForRollResult]);

  useEffect(() => {
    if (props.rollButtonHidden === true) {
      setDicesVisible(false);
    }
  }, []);

  const stompClient = useStompClient();

  useSubscription("/topic/getdicerollresult", (message) => {
    if (props.playerIDForGame === 2) {
      setPresetColorForRollResultForTheOtherPlayer(
        JSON.parse(message.body).diceRolls
      );
      setTimeout(function () {
        groupForTheOtherPlayer(JSON.parse(message.body).diceRolls);
      }, 1500);
    }
  });

  useSubscription("/topic/getseledteddiceforreroll", (message) => {
    if (props.playerIDForGame === 2) {
      console.log("hiii");
      selectDiceForReroll(JSON.parse(message.body).diceColor);
    }
  });

  useSubscription("/topic/getcanceleddice", (message) => {
    if (props.playerIDForGame === 2) {
      cancelDiceForReroll(JSON.parse(message.body).diceValue);
    }
  });

  useSubscription("/topic/getnewdiceforroll", (message) => {
    if (props.playerIDForGame === 2) {
      prepareForReRoll();
    }
  });

  useSubscription("/topic/getmarkedcells", (message) => {
    if (props.playerIDForGame !== playerToMarkCells) {
      selectedDiceColorToMarkCellIsSent = true;
      selectDiceColorToMarkCells(JSON.parse(message.body).value);
      selectedDiceColorToMarkCellIsSent = false;
    }
  });

  useSubscription("/topic/getwhichplayeristomarkcells", (message) => {
    if (JSON.parse(message.body).whoseTurnItIs === 1) {
      setPlayerToMarkCells(2);
    } else if (JSON.parse(message.body).whoseTurnItIs === 2) {
      setPlayerToMarkCells(1);
    }
    setRollingIsOver(true);
  });

  useSubscription("/topic/turnisover", (message) => {
    startNewTurn();
  });

  const sendRollResultsAndGroupThem = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/rolleddice",
        body: JSON.stringify(diceRollResults),
      });
    } else {
      //Handle error
    }
    groupDicesByColor(dicesGroupedByColor, diceRollResults.diceRolls);
    setDicesGroupedByColor(dicesGroupedByColor);
    setDicesVisible(false);
    setStopButtonVisible(true);
  };

  const sendSelectedDiceForReroll = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/selecteddiceforreroll",
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

  const sendWhichPlayerIsToMarkCells = () => {
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

  const getRolledDicesColorAndSendThemToServer = (diceColor, number) => {
    if (props.playerIDForGame === playerToMarkCells) {
      if (diceRollResults.diceRolls.length < numberOfRolledDices) {
        diceRollResults.diceRolls.push({
          diceNumber: "dice1",
          diceColor: diceColor,
        });
      }
      if (diceRollResults.diceRolls.length === numberOfRolledDices) {
        sendRollResultsAndGroupThem();
      }
    }
  };

  const setPresetColorForRollResultForTheOtherPlayer = (rolls) => {
    let values = [];
    for (let i = 0; i < rolls.length; i++) {
      values.push(rolls[i].diceColor);
    }
    setPresetColorForRollResult(values);
  };

  const groupForTheOtherPlayer = (rolls) => {
    if (props.playerIDForGame === 2) {
      groupDicesByColor(dicesGroupedByColor, rolls);
      setDicesGroupedByColor(dicesGroupedByColor);
      setDicesVisible(false);
      setStopButtonVisible(true);
    }
  };

  const handleClickOnDice = (diceColor) => {
    if (rollingIsOver && playerToMarkCells === props.playerIDForGame) {
      selectDiceColorToMarkCells(diceColor);
      sendWhichPlayerIsToMarkCells();
    } else {
      selectDiceForReroll(diceColor);
    }
  };

  const selectDiceForReroll = (diceColor) => {
    if (props.rerollCounter !== "third" && diceColor !== 5) {
      let removedDice = removeSelectedDiceFromGroupAndReturnIt(
        dicesGroupedByColor,
        diceColor
      );
      addSelectedDiceToGroup(selectedDicesForReroll, removedDice);
      setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
      setSelectedDicesForReroll((diceGroup) => ({ ...diceGroup }))
      if (playerToMarkCells === props.playerIDForGame) {
        sendSelectedDiceForReroll(removedDice);
        setRerollButtonVisible(true);
      }
    }
    setStopButtonVisible(false);
  };

  const findSelectedDicesKeyInGroup = (dicesGroupedByColor, diceColor) => {
    let selectedDicesKey;
    for (const [key] of Object.entries(dicesGroupedByColor)) {
      if (
        dicesGroupedByColor[key][0] !== undefined &&
        dicesGroupedByColor[key][0].diceColor === diceColor
      ) {
        selectedDicesKey = key;
        break;
      }
    }
    return selectedDicesKey;
  };

  const checkIfRerollFieldIsEmpty = (dicesGroupedByColor) => {
    for (const [key] of Object.entries(dicesGroupedByColor)) {
      if (dicesGroupedByColor[key].length !== 0) {
        console.log(dicesGroupedByColor[key])
        return false
      }
    }
    return true;
  };

  const removeSelectedDiceFromGroupAndReturnIt = (
    dicesGroupedByColor,
    diceColor
  ) => {
    let selectedDicesKey = findSelectedDicesKeyInGroup(
      dicesGroupedByColor,
      diceColor
    );
    let selectedDice = dicesGroupedByColor[selectedDicesKey].pop();
    return selectedDice;
  };

  const addSelectedDiceToGroup = (dicesGroupedByColor, dice) => {
    let selectedDicesKey = findSelectedDicesKeyInGroup(
      dicesGroupedByColor,
      dice.diceColor
    );
    if (selectedDicesKey === undefined) {
      groupDicesByColor(dicesGroupedByColor, [dice]);
    } else {
      dicesGroupedByColor[selectedDicesKey].push(dice);
    }
  };

  const cancelDiceForReroll = (diceColor) => {
    let removedDice = removeSelectedDiceFromGroupAndReturnIt(
      selectedDicesForReroll,
      diceColor
    );
    addSelectedDiceToGroup(dicesGroupedByColor, removedDice);
    setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
    setSelectedDicesForReroll((diceGroup) => ({ ...diceGroup }))
    if (checkIfRerollFieldIsEmpty(selectedDicesForReroll)) {
      setRerollButtonVisible(false);
      setStopButtonVisible(true);
    }
  };

  const groupDicesByColor = (group, dices) => {
    for (let dice of dices) {
      if (dice.diceColor === 1) {
        group.purple.push(dice);
      } else if (dice.diceColor === 2) {
        group.black.push(dice);
      } else if (dice.diceColor === 3) {
        group.orange.push(dice);
      } else if (dice.diceColor === 4) {
        group.rose.push(dice);
      } else if (dice.diceColor === 5) {
        group.skull.push(dice);
      } else if (dice.diceColor === 6) {
        group.turquoise.push(dice);
      }
    }
    // setDicesGroupedByColor(dicesGroupedByColor);
    // setDicesVisible(false);
    // setStopButtonVisible(true);
  };

  const prepareForReRoll = () => {
    setDicesToBeRolled({ diceRolls: selectedDicesForReroll });
    setSelectedDicesForReroll([]);
    setNumberOfRolledDices(selectedDicesForReroll.length);
    setDicesVisible(true);
    setRerollButtonVisible(false);
    if (props.playerIDForGame === 1) {
      sendNewDiceForRoll({ diceRolls: selectedDicesForReroll });
    }
    if (props.rerollCounter === 1) {
      props.setRerollCounter("second");
    } else if (props.rerollCounter === "second") {
      props.setRerollCounter("third");
    }
    let newAllDiceToRoll = [];
    for (let i = 0; i < selectedDicesForReroll.length; i++) {
      newAllDiceToRoll.push(allDiceToRoll[i]);
    }
    setAllDiceToRoll(newAllDiceToRoll);
    setDiceActionAfterRoll(selectDiceForReroll);
  };

  const endRollingPhase = (value) => {
    setPlayerToMarkCells(props.playerIDForGame); //handle the case when inactive player presses STOP
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
    if (props.playerIDForGame === 1 && playerToMarkCells === 1) {
      selectPlayer(value, 1, cells);
    } else if (props.playerIDForGame === 1 && playerToMarkCells === 2) {
      selectPlayer(value, 2, cells);
    } else if (props.playerIDForGame === 2 && playerToMarkCells === 1) {
      selectPlayer(value, 1, cells);
    } else if (props.playerIDForGame === 2 && playerToMarkCells === 2) {
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
    let numberOfCellsToMark =
      deleteDiceGroupByColorAndGetNumberOfCellsToMark(selectedDiceColor);
    markCells(numberOfCellsToMark, selectedDiceColor);
    setDicesGroupedByColor(dicesGroupedByColor);
    if (!selectedDiceColorToMarkCellIsSent) {
      let markedCells = {
        numberOfDice: numberOfCellsToMark,
        value: selectedDiceColor,
      };
      sendMarkedCells(markedCells);
      selectedDiceColorToMarkCellIsSent = false;
    }
  };

  const deleteDiceGroupByColorAndGetNumberOfCellsToMark = (diceColor) => {
    let numberOfCellsToMark = 0;
    for (const [key] of Object.entries(dicesGroupedByColor)) {
      if (
        dicesGroupedByColor[key][0] !== undefined &&
        dicesGroupedByColor[key][0].diceColor === diceColor
      ) {
        numberOfCellsToMark = dicesGroupedByColor[key].length;
        dicesGroupedByColor[key] = [];
        break;
      }
    }
    return numberOfCellsToMark;
  };

  const startNewTurn = () => {
    setDicesToBeRolled(defaultDicesToBeRolled);
    setDicesVisible(true);
  };

  return (
    <div className="dice-field">
      <Row>
        <Col>
          <DiceGroupingField
            dicesVisible={dicesVisible}
            myDice={myDice}
            getDiceValue={getRolledDicesColorAndSendThemToServer}
            handleClickOnDice={handleClickOnDice}
            groupedDiceRolls={dicesGroupedByColor}
            faces={faces}
          ></DiceGroupingField>
        </Col>
        <Col>
          <RerollSelectionField
            reRoll={prepareForReRoll}
            selectedDicesForReroll={selectedDicesForReroll}
            cancelDiceForReroll={cancelDiceForReroll}
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
            diceRolls={dicesToBeRolled}
            dicesVisible={dicesVisible}
            presetColorForRollResult={presetColorForRollResult}
            getDiceValue={getRolledDicesColorAndSendThemToServer}
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
