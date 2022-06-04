import './App.css';
import Board from './components/Board';
import "antd/dist/antd.css";
import {Card, Space, Col, Row, Button} from "antd";
import axios from "axios";

const savePlayer = () =>{
  const player = { id: "1234", playerName: "player"};
  axios
  .post("http://localhost:8080/registernewplayer", player)
  .then((response) => {
    console.log("hi");
  })
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <button onClick={() => {
          savePlayer();
      }}>CLICK</button>
      <Row>
        <Col className="leftColumn" span={12}><Board></Board></Col>
        <Col className="rightColumn" span={12}><Board></Board></Col>
      </Row>
      </header>
    </div>
  );
}

export default App;
