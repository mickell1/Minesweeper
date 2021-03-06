import React from 'react';
import Row from './Row';
import '../styles/board.css';

export default class Board extends React.Component {
  renderRows() {
    const rows = []
    this.props.board.forEach((row, i) => {
      rows.push(
        <Row 
          key={i}
          row={row}
          x={i}
          cellSize={this.props.cellSize}
          onClick={this.props.onClick}
          onRightClick={this.props.onRightClick}
          onDoubleClick={this.props.onDoubleClick}
        />
      )
    })
    return rows
  }

  render() {
    return (
      <div className="board">
        {this.renderRows()}
      </div>
    )
  }
}