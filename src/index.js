import React from 'react';
import ReactDOM from 'react-dom';
import { Segment, Container, Header, Step, Label } from 'semantic-ui-react'
import './index.css';
import 'semantic-ui-css/semantic.min.css';


const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          </div>
      </div>
    );
  }
}
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  StepItem = (move, desc, color) => (
    <Step key={move} onClick={() => this.jumpTo(move)}>
      <Step.Content>
        <Step.Title>
          <Label color={color} floating>{move}</Label>
          {desc}
        </Step.Title>
      </Step.Content>
    </Step>
  );
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #'.concat(move) : 'Go to game start';
      const color = move === history.length - 1 ? 'red' : 'grey' ;
      return (
        this.StepItem(move, desc, color)
      );
    });
    
    let status;
    if (winner) {
      status = 'winner: '.concat(winner);
    } else {
      status = 'Next player: '.concat(this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <Container className="containerStyle">
        <Segment className="segmentStyle" piled>
          <Header as="h2" >{status}</Header>
          <div className="game">
            <div className="game-board">
              <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <Step.Group vertical>
                {moves}
              </Step.Group>
            </div>
          </div>
        </Segment>
      </Container>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);