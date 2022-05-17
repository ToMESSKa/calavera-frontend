import './App.css';
import Board from './components/Board';
import "antd/dist/antd.css";
import {Card, Space, Col, Row, Button} from "antd";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Row>
        <Col className="leftColumn" span={12}><Board></Board></Col>
        <Col className="rightColumn" span={12}><Board></Board></Col>
      </Row>
      </header>
    </div>
  );
}

export default App;
