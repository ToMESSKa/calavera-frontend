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
  const [dicesVisible, setDicesVisible] = useState("visible");
  const [rollingIsOver, setRollingIsOver] = useState(false);
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
  const [markedOrangeCellsCounter, setOrangeCellsToMark] = useState(0);
  const [markedPurpleCellsCounter, setRedCellsToMark] = useState(0);
  const [markedTurquoiseCellsCounter, setTurquoiseCellsToMark] = useState(0);
  const [markedBlackCellsCounter, setBlackCellsToMark] = useState(0);
  const [playerToMarkCells, setPlayerToMarkCells] = useState(1);
  const [mainPlayerTurnIsOver, setMainPlayerTurnIsOver] = useState(false);
  const [isTurnOver, setTurnOver] = useState(false);
  const [stopButtonDisabled, setstopButtonDisabled] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState(1);
  const faces = [purple, black, orange, rose, skull, turquoise];
  let counter = 0;
  let selectedDiceColorToMarkCellIsSent = false;

  useEffect(() => {
    if (
      props.playerIDForGame !== playerToMarkCells &&
      presetColorForRollResult !== 0
    ) {
      rollAllDicesForTheOtherPlayer();
    }
  }, [presetColorForRollResult]);

  useEffect(() => {
    if (props.rollButtonHidden === true) {
      setDicesVisible("hidden");
    }
  }, []);

  const stompClient = useStompClient();

  useSubscription("/topic/getdicerollresult", (message) => {
    if (props.playerIDForGame === 2 && props.ownerOfDiceField === 1) {
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
    if (
      (props.playerIDForGame === 2 &&
        playerToMarkCells === 1 &&
        props.ownerOfDiceField === 1) ||
      (props.playerIDForGame === 1 &&
        playerToMarkCells === 2    &&
        props.ownerOfDiceField === 1)
    ) {
      console.log(props.dicesGroupedByColor);
      selectedDiceColorToMarkCellIsSent = true;
      selectDiceColorToMarkCells(JSON.parse(message.body).value);
      selectedDiceColorToMarkCellIsSent = false;
      console.log(props.dicesGroupedByColor);
    }
  });
  // }else if ()
  // selectedDiceColorToMarkCellIsSent = true;
  // selectDiceColorToMarkCells(JSON.parse(message.body).value);
  // selectedDiceColorToMarkCellIsSent = false;

  //   if (
  //     props.playerIDForGame !== props.ownerOfDiceField &&
  //     playerToMarkCells !== props.playerIDForGame
  //   ) {
  //     selectedDiceColorToMarkCellIsSent = true;
  //     selectDiceColorToMarkCells(JSON.parse(message.body).value);
  //     selectedDiceColorToMarkCellIsSent = false;
  //     console.log(props.dicesGroupedByColor);
  //   } else if (
  //     props.playerIDForGame === props.ownerOfDiceField &&
  //     playerToMarkCells !== props.playerIDForGame
  //   ) {
  //     selectedDiceColorToMarkCellIsSent = true;
  //     selectDiceColorToMarkCells(JSON.parse(message.body).value);
  //     selectedDiceColorToMarkCellIsSent = false;
  //     console.log(props.dicesGroupedByColor);
  //   }
  // })
  // if ( /// this brach in forn when
  //   props.playerIDForGame !== props.ownerOfDiceField &&
  //   playerToMarkCells !== props.playerIDForGame
  // ) {
  //   selectedDiceColorToMarkCellIsSent = true;
  //   selectDiceColorToMarkCells(JSON.parse(message.body).value);
  //   selectedDiceColorToMarkCellIsSent = false;
  // }
  // if (
  //   props.playerIDForGame === props.ownerOfDiceField &&
  //   playerToMarkCells !== props.playerIDForGame
  // ) {
  //   console.log(props.dicesGroupedByColor);
  // }

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
    groupDicesByColor(props.dicesGroupedByColor, diceRollResults.diceRolls);
    if (props.ownerOfDiceField === 1) {
      props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
    }
    setDicesVisible("hidden");
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
    console.log(degroupedDices);
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
    if (props.playerIDForGame === playerToMarkCells) {
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
    if (props.playerIDForGame === 2 && props.ownerOfDiceField === 1) {
      groupDicesByColor(props.dicesGroupedByColor, rolls);
      console.log(props.dicesGroupedByColor);
      props.setDicesGroupedByColor(props.dicesGroupedByColor);
      setDicesVisible("hidden");
      setStopButtonVisible(true);
      setstopButtonDisabled(true);
    }
    console.log(props.dicesGroupedByColor);
    // props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
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
        props.dicesGroupedByColor,
        diceColor
      );
      addSelectedDiceToGroup(selectedDicesForReroll, removedDice);
      props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
      setSelectedDicesForReroll((diceGroup) => ({ ...diceGroup }));
      if (playerToMarkCells === props.playerIDForGame) {
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
        console.log(dicesGroupedByColor[key]);
        return false;
      }
    }
    return true;
  };

  const removeSelectedDiceFromGroupAndReturnIt = (
    dicesGroupedByColor,
    diceColor
  ) => {
    console.log(dicesGroupedByColor);
    console.log(diceColor);
    let selectedDicesKey = findSelectedDicesKeyInGroup(
      dicesGroupedByColor,
      diceColor
    );
    console.log(selectedDicesKey);
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
    if (playerToMarkCells === props.playerIDForGame) {
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
    setDicesVisible("visible");
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
    setPlayerToMarkCells(props.playerIDForGame); //handle the case when inactive player presses STOP
    setRollingIsOver(true);
  };

  const markCells = (numberOfDices, diceColor) => {
    let cells = [];
    console.log(numberOfDices);
    console.log(diceColor);
    let numberOfMarkedCells = getNumberOfMarkedCells(diceColor);
    console.log(numberOfMarkedCells);
    for (let i = 0; i < 13; i++) {
      if (i < numberOfMarkedCells + numberOfDices) {
        cells.push("X");
      } else {
        cells.push("");
      }
    }

    console.log(props.playerIDForGame);
    console.log(playerToMarkCells);
    console.log(props.ownerOfDiceField);
    if (
      //run
      props.playerIDForGame === 1 &&
      playerToMarkCells === 1 &&
      props.ownerOfDiceField === 1
    ) {
      setMarkedCells(diceColor, 1, cells);
    } else if (
      props.playerIDForGame === 1 &&
      playerToMarkCells === 2 &&
      props.ownerOfDiceField === 1
    ) {
      setMarkedCells(diceColor, 2, cells);
    } else if (
      //Run
      props.playerIDForGame === 2 &&
      playerToMarkCells === 1 &&
      props.ownerOfDiceField === 1
    ) {
      setMarkedCells(diceColor, 1, cells);
    } else if ( //other
      props.playerIDForGame === 2 &&
      playerToMarkCells === 2 &&
      props.ownerOfDiceField === 1
    ) {
      console.log("ughh");
      setMarkedCells(diceColor, 2, cells);
    }
  };

  const getNumberOfMarkedCells = (diceColor) => {
    if (diceColor === 1) {
      return markedPurpleCellsCounter;
    } else if (diceColor === 2) {
      return markedBlackCellsCounter;
    } else if (diceColor === 3) {
      return markedOrangeCellsCounter;
    } else if (diceColor === 6) {
      return markedTurquoiseCellsCounter;
    }
  };

  const setMarkedCells = (diceColor, player, cells) => {
    if (player === 1 && diceColor === 1) {
      props.setPlayerOnePurpleCells(cells);
      console.log("heyy");
    } else if (player === 1 && diceColor === 2) {
      props.setPlayerOneBlackCells(cells);
      console.log("heyy");
    } else if (player === 1 && diceColor === 3) {
      props.setPlayerOneOrangeCells(cells);
      console.log("heyy");
    } else if (player === 1 && diceColor === 6) {
      props.setPlayerOneTurquoiseCells(cells);
      console.log("heyy");
    } else if (player === 2 && diceColor === 1) {
      props.setPlayerTwoPurpleCells(cells);
      console.log("heyy");
    } else if (player === 2 && diceColor === 2) {
      console.log(cells);
      props.setPlayerTwoBlackCells(cells);
      console.log("heyy");
    } else if (player === 2 && diceColor === 3) {
      props.setPlayerTwoOrangeCells(cells);
      console.log("heyy");
    } else if (player === 2 && diceColor === 6) {
      props.setPlayerTwoTurquoiseCells(cells);
      console.log("heyy");
    }
  };

  const selectDiceColorToMarkCells = (selectedDiceColor) => {
    console.log(props.dicesGroupedByColor);
    let numberOfCellsToMark =
      deleteDiceGroupByColorAndGetNumberOfCellsToMark(selectedDiceColor);
    props.setDicesGroupedByColor((diceGroup) => ({ ...diceGroup }));
    console.log(numberOfCellsToMark);
    markCells(numberOfCellsToMark, selectedDiceColor);
    if (!selectedDiceColorToMarkCellIsSent) {
      let markedCells = {
        numberOfDice: numberOfCellsToMark,
        value: selectedDiceColor,
      };
      sendMarkedCells(markedCells);
      selectedDiceColorToMarkCellIsSent = false;
    }
    checkIfTurnIsOver();
  };

  const checkIfTurnIsOver = () => {
    if (startingPlayer !== playerToMarkCells) {
      startNewTurn();
    }
  };

  const deleteDiceGroupByColorAndGetNumberOfCellsToMark = (diceColor) => {
    let numberOfCellsToMark = 0;
    console.log(diceColor);
    console.log(props.dicesGroupedByColor);
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

  const startNewTurn = () => {};

  return (
    <div className="dice-field">
      <Row>
        <Col>
          <DiceGroupingField
            dicesVisible={dicesVisible}
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
          {stopButtonVisible ? (
            <button disabled={stopButtonDisabled} onClick={endRollingPhase}>
              STOP
            </button>
          ) : (
            <div></div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <DiceRollingField
            diceReferences={props.diceReferences}
            dicesToBeRolled={dicesToBeRolled}
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
