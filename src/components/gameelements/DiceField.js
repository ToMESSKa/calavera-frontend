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

  const myButton = useRef();
  const [presetColorForRollResult, setPresetColorForRollResult] = useState(0);
  const [dicesToBeRolled, setDicesToBeRolled] = useState(
    defaultDicesToBeRolled
  );
  const [diceRollResults, setDiceRollResults] = useState({ diceRolls: [] });
  // const [dicesGroupedByColor, setDicesGroupedByColor] = useState({
  //   purple: [],
  //   black: [],
  //   orange: [],
  //   rose: [],
  //   skull: [],
  //   turquoise: [],
  // });
  // const [dicesVisible, setDicesVisible] = useState("visible");
  // const [rollButtonVisible, setrollButtonVisible] = useState("visible");
  const [rollingIsOver, setRollingIsOver] = useState(false);
  const [stopButtonVisible, setStopButtonVisible] = useState("hidden");
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
  // const [markedOrangeCellsCounter, setMarkedOrangeCellsCounter] = useState(0);
  // const [markedPurpleCellsCounter, setMarkedPurpleCellsCounter] = useState(0);
  // const [markedTurquoiseCellsCounter, setMarkedTurquoiseCellsCounter] =
  //   useState(0);
  // const [markedBlackCellsCounter, setMarkedBlackCellsCounter] = useState(0);
  const [mainPlayerTurnIsOver, setMainPlayerTurnIsOver] = useState(false);
  const [isTurnOver, setTurnOver] = useState(false);
  const [stopButtonDisabled, setstopButtonDisabled] = useState(false);
  const faces = [purple, black, orange, rose, skull, turquoise];
  let counter = 0;
  let selectedDiceColorToMarkCellIsSent = false;

  useEffect(() => {
    if (
      props.playerIDForGame !== props.playerToMarkCells &&
      presetColorForRollResult !== 0
    ) {
      rollAllDicesForTheOtherPlayer();
    }
  }, [presetColorForRollResult]);

  useEffect(() => {
    if (props.rollButtonVisible === "hidden") {
      props.setDicesVisible("hidden");
    }
  }, []);

  useEffect(() => {
    if (props.playerToMarkCells !== props.ownerOfDiceField) {
      props.setDicesVisible("hidden");
      props.setRollButtonVisible("hidden");
      props.setRerollCounterVisible("hidden");
    }
  }, []);

  const stompClient = useStompClient();

  useSubscription("/topic/getdicerollresult", (message) => {
    // console.log(props.startingPlayer);
    // console.log(props.ownerOfDiceField);
    if (
      props.playerIDForGame !== props.startingPlayer &&
      props.ownerOfDiceField === props.startingPlayer
    ) {
      setPresetColorForRollResultForTheOtherPlayer(
        JSON.parse(message.body).diceRolls
      );
      // setTimeout(function () {
      //   groupForTheOtherPlayer(JSON.parse(message.body).diceRolls);
      // }, 1500);
    }
    setTimeout(function () {
      groupForTheOtherPlayer(JSON.parse(message.body).diceRolls);
    }, 1500);
  });

  useSubscription("/topic/getseledteddiceforreroll", (message) => {
    if (props.playerIDForGame === 2) {
      selectDiceForRerollForTheOtherPlayer(JSON.parse(message.body).diceColor);
    }
  });

  useSubscription("/topic/getcanceleddice", (message) => {
    if (props.playerIDForGame === 2 && props.ownerOfDiceField === 1) {
      cancelDiceForReroll(JSON.parse(message.body).diceColor);
    }
  });

  useSubscription("/topic/getnewdicesforroll", (message) => {
    if (props.playerIDForGame === 2) {
      setDiceFieldForReroll(JSON.parse(message.body));
    }
  });

  useSubscription("/topic/getmarkedcells", (message) => {
    console.log("served answered");
    console.log("playerID for game: " + props.playerIDForGame);
    console.log("player to mark cells: " + props.playerToMarkCells);
    console.log("owner of dicefield: " + props.ownerOfDiceField);
    console.log("starting player: " + props.startingPlayer);
    console.log(props.dicesGroupedByColor);
    if (checkIfCellsShouldBeMarked() === true) {
      // console.log("sucess");
      selectedDiceColorToMarkCellIsSent = true;
      selectDiceColorToMarkCells(
        JSON.parse(message.body).value,
        props.playerToMarkCells
      );
      selectedDiceColorToMarkCellIsSent = false;
    } else {
      // console.log("fail");
    }
    if (props.startingPlayer === JSON.parse(message.body).playerToMarkCells) {
      if (props.startingPlayer === 1) {
        props.setPlayerToMarkCells(2);
      } else {
        props.setPlayerToMarkCells(1);
      }
      setRollingIsOver(true);
    }
  });

  useSubscription("/topic/getwhichplayeristomarkcells", (message) => {
    if (
      JSON.parse(message.body).whoseTurnItIs === 1 &&
      props.playerIDForGame === 1
    ) {
      props.setPlayerToMarkCells(2);
    } else if (
      JSON.parse(message.body).whoseTurnItIs === 1 &&
      props.playerIDForGame === 2
    ) {
      props.setPlayerToMarkCells(2);
    }
    setRollingIsOver(true);
  });

  useSubscription("/topic/turnisover", (message) => {
    startNewTurn();
    // console.log(props.startingPlayer);
    props.setStartingPlayer(2);
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
    groupDicesByColor(props.dicesGroupedByColor, diceRollResults.diceRolls);
    if (props.ownerOfDiceField === props.startingPlayer) {
      props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
    }
    props.setDicesVisible("hidden");
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

  const sendCancelledDiceForReroll = (dice) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/canceleddice",
        body: JSON.stringify(dice),
      });
    } else {
      //Handle error
    }
  };

  const sendNewDicesForRoll = (degroupedDices) => {
    // console.log(degroupedDices);
    if (stompClient) {
      stompClient.publish({
        destination: "/app/newdicesforroll",
        body: JSON.stringify({ diceRolls: degroupedDices }),
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
        body: JSON.stringify({ whoseTurnItIs: props.playerToMarkCells }),
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

  const checkIfCellsShouldBeMarked = () => {
    // console.log("playerID for game: " + props.playerIDForGame);
    // console.log("player to mark cells: " + props.playerToMarkCells);
    // console.log("owner of dicefield: " + props.ownerOfDiceField);
    // console.log("starting player: " + props.startingPlayer);
    // console.log(props.dicesGroupedByColor);
    if (
      (props.playerIDForGame === 2 && // when player one is starting player and chooses
        props.playerToMarkCells === 1 &&
        props.ownerOfDiceField === 1 &&
        props.startingPlayer === 1) ||
      (props.playerIDForGame === 1 && // when player one is starting player and player two chooses
        props.playerToMarkCells === 2 &&
        props.ownerOfDiceField === 1 &&
        props.startingPlayer === 1) ||
      (props.playerIDForGame === 1 && // when player two is starting player and chooses
        props.playerToMarkCells === 2 &&
        props.ownerOfDiceField === 2 &&
        props.startingPlayer === 2) ||
      (props.playerIDForGame === 2 && // when player two is starting player and player one chooses
        props.playerToMarkCells === 1 &&
        props.ownerOfDiceField === 2 &&
        props.startingPlayer === 2)
    ) {
      // console.log("true");
      return true;
    }
  };

  const rollAllDices = (e) => {
    for (let dice of props.diceReferences) {
      dice.current.rollDice();
    }
  };

  const rollAllDicesForTheOtherPlayer = (e) => {
    if (props.ownerOfDiceField === 1) {
      rollAllDices();
    }
  };

  const getRolledDicesColorAndSendThemToServer = (diceColor, number) => {
    if (props.playerIDForGame === props.playerToMarkCells) {
      if (diceRollResults.diceRolls.length < numberOfRolledDices) {
        diceRollResults.diceRolls.push({
          diceNumber: "dice1",
          diceColor: diceColor,
        });
      }
      if (diceRollResults.diceRolls.length === numberOfRolledDices) {
        sendRollResultsAndGroupThem();
        setDiceRollResults({ diceRolls: [] });
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
    // console.log(props.playerToMarkCells);
    // console.log(props.startingPlayer);
    if (
      props.playerIDForGame !== props.playerToMarkCells &&
      props.ownerOfDiceField === props.startingPlayer
    ) {
      groupDicesByColor(props.dicesGroupedByColor, rolls);
      // console.log(props.dicesGroupedByColor);
      props.setDicesGroupedByColor(props.dicesGroupedByColor);
      props.setDicesVisible("hidden");
      setStopButtonVisible(true);
      setstopButtonDisabled(true);
    }
    // console.log(props.dicesGroupedByColor);
    props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
  };

  const handleClickOnDice = (diceColor) => {
    if (rollingIsOver && props.playerToMarkCells === props.playerIDForGame) {
      selectDiceColorToMarkCells(diceColor, props.playerToMarkCells);
    } else {
      selectDiceForReroll(diceColor);
    }
  };

  const selectDiceForReroll = (diceColor) => {
    if (props.rerollCounter !== "third" && diceColor !== 5) {
      let removedDice = removeSelectedDiceFromGroupAndReturnIt(
        props.dicesGroupedByColor,
        diceColor
      );
      addSelectedDiceToGroup(selectedDicesForReroll, removedDice);
      props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
      setSelectedDicesForReroll((diceGroup) => ({ ...diceGroup }));
      if (props.playerToMarkCells === props.playerIDForGame) {
        sendSelectedDiceForReroll(removedDice);
        setRerollButtonVisible(true);
      }
    }
    setStopButtonVisible(false);
  };

  const selectDiceForRerollForTheOtherPlayer = (diceColor) => {
    if (props.ownerOfDiceField === 1) {
      selectDiceForReroll(diceColor);
    }
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
        return false;
      }
    }
    return true;
  };

  const removeSelectedDiceFromGroupAndReturnIt = (
    dicesGroupedByColor,
    diceColor
  ) => {
    // console.log(dicesGroupedByColor);
    // console.log(diceColor);
    let selectedDicesKey = findSelectedDicesKeyInGroup(
      dicesGroupedByColor,
      diceColor
    );
    // console.log(selectedDicesKey);
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
    addSelectedDiceToGroup(props.dicesGroupedByColor, removedDice);
    props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
    setSelectedDicesForReroll((diceGroup) => ({ ...diceGroup }));
    if (checkIfRerollFieldIsEmpty(selectedDicesForReroll)) {
      setRerollButtonVisible(false);
      setStopButtonVisible(true);
    }
    if (props.playerToMarkCells === props.playerIDForGame) {
      sendCancelledDiceForReroll(removedDice);
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
  };

  const degroupDices = (dicesGroupedByColor) => {
    let dices = [];
    for (const [key] of Object.entries(dicesGroupedByColor)) {
      if (dicesGroupedByColor[key].length !== 0) {
        for (let dice of dicesGroupedByColor[key]) {
          dices.push(dice);
        }
      }
    }
    return dices;
  };

  const setDiceFieldForReroll = (newDices) => {
    setDicesToBeRolled(newDices);
    setSelectedDicesForReroll(defaultDicesGroupedByColor);
    props.setDicesVisible("visible");
    props.diceReferences.splice(newDices.diceRolls.length);
    props.setDiceReferences(props.diceReferences);
    setNumberOfRolledDices(newDices.diceRolls.length);
    increaseRollCounter();
  };

  const increaseRollCounter = () => {
    if (props.rerollCounter === "first") {
      props.setRerollCounter("second");
    } else if (props.rerollCounter === "second") {
      props.setRerollCounter("third");
    }
  };

  const prepareForReRoll = () => {
    let newDicesToBeRolled = degroupDices(selectedDicesForReroll);
    setDiceFieldForReroll({ diceRolls: newDicesToBeRolled });
    setRerollButtonVisible(false);
    sendNewDicesForRoll(newDicesToBeRolled);
  };

  const endRollingPhase = (value) => {
    props.setPlayerToMarkCells(props.playerIDForGame); //handle the case when inactive player presses STOP
    setRollingIsOver(true);
  };

  const markCells = (numberOfDices, diceColor, ownerOfDiceField) => {
    // console.log("black " + props.markedBlackCellsCounter);
    // console.log("orange: " + props.markedOrangeCellsCounter);
    // console.log("purple: " + props.markedPurpleCellsCounter);
    // console.log("turquiuse: " + props.markedTurquoiseCellsCounter);
    let cells = [];
    let numberOfMarkedCells = getNumberOfMarkedCells(diceColor);
    console.log("number of marked cells: " + numberOfMarkedCells);
    for (let i = 0; i < 13; i++) {
      if (i < numberOfMarkedCells + numberOfDices) {
        cells.push("X");
      } else {
        cells.push("");
      }
    }
    if (ownerOfDiceField === 1 && diceColor === 1) {
      props.setPlayerOnePurpleCells(cells);
      props.setMarkedPurpleCellsCounterPlayerOne(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 1 && diceColor === 2) {
      props.setPlayerOneBlackCells(cells);
      props.setMarkedBlackCellsCounterPlayerOne(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 1 && diceColor === 3) {
      props.setPlayerOneOrangeCells(cells);
      props.setMarkedOrangeCellsCounterPlayerOne(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 1 && diceColor === 6) {
      props.setPlayerOneTurquoiseCells(cells);
      props.setMarkedTurquoiseCellsCounterPlayerOne(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 2 && diceColor === 1) {
      props.setPlayerTwoPurpleCells(cells);
      props.setMarkedPurpleCellsCounterPlayerTwo(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 2 && diceColor === 2) {
      props.setPlayerTwoBlackCells(cells);
      props.setMarkedBlackCellsCounterPlayerTwo(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 2 && diceColor === 3) {
      props.setPlayerTwoOrangeCells(cells);
      props.setMarkedOrangeCellsCounterPlayerTwo(
        numberOfMarkedCells + numberOfDices
      );
    } else if (ownerOfDiceField === 2 && diceColor === 6) {
      props.setPlayerTwoTurquoiseCells(cells);
      props.setMarkedTurquoiseCellsCounterPlayerTwo(
        numberOfMarkedCells + numberOfDices
      );
    }
  };

  const getNumberOfMarkedCells = (diceColor) => {
    if (diceColor === 1 && props.ownerOfDiceField === 2) {
      return props.markedPurpleCellsCounterPlayerOne;
    } else if (diceColor === 1 && props.ownerOfDiceField === 1) {
      return props.markedPurpleCellsCounterPlayerTwo;
    } else if (diceColor === 2 && props.ownerOfDiceField === 2) {
      return props.markedBlackCellsCounterPlayerOne;
    } else if (diceColor === 2 && props.ownerOfDiceField === 1) {
      return props.markedBlackCellsCounterPlayerTwo;
    } else if (diceColor === 3 && props.ownerOfDiceField === 2) {
      return props.markedOrangeCellsCounterPlayerOne;
    } else if (diceColor === 3 && props.ownerOfDiceField === 1) {
      return props.markedOrangeCellsCounterPlayerTwo;
    } else if (diceColor === 6 && props.ownerOfDiceField === 2) {
      return props.markedTurquoiseCellsCounterPlayerTwo;
    } else if (diceColor === 6 && props.ownerOfDiceField === 1) {
      return props.markedTurquoiseCellsCounterPlayerOne;
    }
  };

  const selectDiceColorToMarkCells = (selectedDiceColor, ownerOfDiceField) => {
    // console.log(props.dicesGroupedByColor);
    let numberOfCellsToMark =
      deleteDiceGroupByColorAndGetNumberOfCellsToMark(selectedDiceColor);
    props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
    // console.log(numberOfCellsToMark);
    markCells(numberOfCellsToMark, selectedDiceColor, ownerOfDiceField);
    if (!selectedDiceColorToMarkCellIsSent) {
      let markedCells = {
        numberOfDice: numberOfCellsToMark,
        value: selectedDiceColor,
        playerToMarkCells: props.playerToMarkCells,
      };
      sendMarkedCells(markedCells);
      // console.log("send again");
      selectedDiceColorToMarkCellIsSent = false;
    }
    checkIfTurnIsOver();
  };

  const checkIfTurnIsOver = () => {
    if (props.startingPlayer !== props.playerToMarkCells) {
      notifyServerAboutTheEndOfTurn();
    }
  };

  const deleteDiceGroupByColorAndGetNumberOfCellsToMark = (diceColor) => {
    let numberOfCellsToMark = 0;
    // console.log(diceColor);
    // console.log(props.dicesGroupedByColor);
    for (const [key] of Object.entries(props.dicesGroupedByColor)) {
      if (
        props.dicesGroupedByColor[key][0] !== undefined &&
        props.dicesGroupedByColor[key][0].diceColor === diceColor
      ) {
        numberOfCellsToMark = props.dicesGroupedByColor[key].length;
        props.dicesGroupedByColor[key] = [];
        break;
      }
    }
    return numberOfCellsToMark;
  };

  const startNewTurn = () => {
    // console.log(props.playerToMarkCells);
    if (props.ownerOfDiceField === props.playerToMarkCells) {
      // console.log(props.playerToMarkCells);
      props.setDicesVisible("visible");
      props.setRerollCounterVisible("visible");
      props.setRollButtonVisible("visible");
    } else {
      props.setDicesGroupedByColor(defaultDicesGroupedByColor);
      props.setRollButtonVisible("hidden");
      setStopButtonVisible("hidden");
      props.setRerollCounterVisible("hidden");
    }
  };

  return (
    <div className="dice-field">
      <Row>
        <Col>
          <DiceGroupingField
            dicesVisible={props.dicesVisible}
            getDiceValue={getRolledDicesColorAndSendThemToServer}
            handleClickOnDice={handleClickOnDice}
            groupedDiceRolls={props.dicesGroupedByColor}
            faces={faces}
          ></DiceGroupingField>
        </Col>
        <Col>
          <RerollSelectionField
            prepareForReRoll={prepareForReRoll}
            selectedDicesForReroll={selectedDicesForReroll}
            cancelDiceForReroll={cancelDiceForReroll}
            rerollButtonVisible={rerollButtonVisible}
            faces={faces}
          ></RerollSelectionField>
        </Col>
        <Col>
          <button
            style={{ visibility: stopButtonVisible }}
            disabled={stopButtonDisabled}
            onClick={endRollingPhase}
          >
            STOP
          </button>
        </Col>
      </Row>
      <Row>
        <Col>
          <DiceRollingField
            diceReferences={props.diceReferences}
            dicesToBeRolled={dicesToBeRolled}
            dicesVisible={props.dicesVisible}
            presetColorForRollResult={presetColorForRollResult}
            getDiceValue={getRolledDicesColorAndSendThemToServer}
            faces={faces}
          ></DiceRollingField>
        </Col>
      </Row>
      <Row>
        {props.dicesVisible ? (
          <button
            style={{ visibility: props.rollButtonVisible }}
            ref={myButton}
            onClick={rollAllDices}
          >
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
