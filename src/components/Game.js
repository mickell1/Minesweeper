import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GiClusterBomb } from 'react-icons/gi'
import Board from './Board'
import config from '../config'
import { toggle, start, changeDifficulty, gameover, clear } from '../actions'
import '../styles/game.css'

class Game extends Component {
  constructor(props) {
    super(props)
    const { difficulty } = this.props
    this.state = { board: this.buildBoard(difficulty) }
    this.handleClick = this.handleClick.bind(this)
    this.handleClickCell = this.handleClickCell.bind(this)
    this.handleRightClickCell = this.handleRightClickCell.bind(this)
    this.handleDoubleClickCell = this.handleDoubleClickCell.bind(this)
  }

  buildBoard(difficulty) {
    const bombPlaces = this.BombPlaces(difficulty)
    const { boardWidth, boardHeight } = config[difficulty]
    const board = Array.from(
      new Array(boardWidth), () => new Array(boardHeight).fill(
        { bomb: false, bombCount: 0, open: false, flagged: false }
      )
    )
    for (let place of bombPlaces) {
      board[place.x][place.y] = Object.assign({}, board[place.x][place.y], { bomb: true })
    }
    return board
  }

  BombPlaces(difficulty) {
    const bombPlaces = []
    const { boardWidth, boardHeight, bombNum } = config[difficulty]
    while (bombPlaces.length < bombNum) {
      const x = Math.floor(Math.random() * boardWidth)
      const y = Math.floor(Math.random() * boardHeight)
      if (bombPlaces.length === 0) {
        bombPlaces.push({ x: x, y: y })
      } else {
        const duplicated = bombPlaces.filter((place) => {
          return place.x === x && place.y === y
        }).length > 0
        if (!duplicated) {
          bombPlaces.push({ x: x, y: y })
        }
      }
    }
    return bombPlaces
  }

  handleClick(e) {
    e.preventDefault()
    const { difficulty } = this.props
    this.props.dispatch(start())
    this.setState({ board: this.buildBoard(difficulty) })
  }

  handleClickCell(x, y) {
    const { gameover, clear } = this.props
    if (gameover || clear) {
      return
    }
    this.open(x, y)
  }

  handleRightClickCell(x, y) {
    const { gameover, clear } = this.props
    if (gameover || clear) {
      return
    }
    this.toggleFlag(x, y)
  }

  handleDoubleClickCell(x, y) {
    const { gameover, clear, difficulty } = this.props
    const { boardWidth, boardHeight } = config[difficulty]
    const { board } = this.state
    if (gameover || clear) {
      return
    }
    if (!board[x][y].open) {
      return
    }

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if ((i < 0 || i >= boardWidth) ||
            (j < 0 || j >= boardHeight) ||
            (i === x && j === y) ||
            (board[i][j].flagged)) {
          continue
        }
        this.open(i, j)
      }
    }
  }

  changeDifficulty(e) {
    const difficulty = e.target.value
    this.props.dispatch(changeDifficulty(difficulty))
    this.setState({ board: this.buildBoard(difficulty) })
  }

  open(x, y) {
    const board = [].concat(this.state.board)
    const { boardWidth, boardHeight } = config[this.props.difficulty]
    if (!board[x][y].open) {
      let bombCount = 0
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if ((i < 0 || i >= boardWidth) ||
              (j < 0 || j >= boardHeight) ||
              (i === x && j === y)) {
            continue
          }
          if (board[i][j].bomb) {
            bombCount++
          }
        }
      }
      board[x][y] = Object.assign({}, board[x][y], { open: true, bombCount: bombCount })
      this.setState({ board })
      if (board[x][y].flagged) {
        this.toggleFlag(x, y)
      }
      if (board[x][y].bomb) {
        this.props.dispatch(gameover())
      }
      if (this.isClear(board)) {
        this.props.dispatch(clear())
      }

      if (bombCount === 0 && !board[x][y].bomb) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if ((i < 0 || i >= boardWidth) ||
                (j < 0 || j >= boardHeight) ||
                (i === x && j === y) ||
                (board[i][j].flagged)) {
              continue
            }
            this.open(i, j)
          }
        }
      }
    }
  }

  isClear(board) {
    let openCount = 0
    const { difficulty } = this.props
    const { boardWidth, boardHeight, bombNum } = config[difficulty]
    board.forEach((row, i) => {
      row.forEach((cell, i) => {
        if (cell.open) {
          openCount++
        }
      })
    })
    return openCount === (boardWidth * boardHeight - bombNum)
  }

  toggleFlag(x, y) {
    const board = [].concat(this.state.board)
    const { flagged } = board[x][y]
    board[x][y] = Object.assign({}, board[x][y], { flagged: !flagged })
    this.setState({ board })
    this.props.dispatch(toggle(!flagged))
  }

  render() {
    const { board } = this.state
    const { difficulty, gameover, clear, bomb } = this.props
    const { boardWidth, cellSize } = config[difficulty]
    const boardWidthPx = boardWidth * cellSize
    let status = <span className="status"></span>
    if (gameover) {
      status = <span id="gameover" className="status">Gameover</span>
    } else if (clear) {
      status = <span id="clear" className="status">Clear!</span>
    }
    return (
      <div id="game" style={{ width: boardWidthPx }}>
        <h1>Minesweeper</h1>
        <div id="menu">
          <span>Difficulty: </span>
          <select value={difficulty} onChange={(e) => this.changeDifficulty(e)} style={{ marginRight: 5 }}>
            <option value={'easy'} key={'easy'}>Easy</option>
            <option value={'normal'} key={'normal'}>Normal</option>
            <option value={'hard'} key={'hard'}>Hard</option>
            <option value={'veryHard'} key={'veryHard'}>Very Hard</option>
            <option value={'insane'} key={'insane'}>Insane</option>
          </select><br />
          <span id="bomb"><GiClusterBomb id='bomblayout' /> {bomb}</span><br />
          <button onClick={this.handleClick} id="restart">Restart</button>
          {status}
        </div>
        <Board
          board={board}
          cellSize={cellSize}
          onClick={this.handleClickCell}
          onRightClick={this.handleRightClickCell}
          onDoubleClick={this.handleDoubleClickCell}
        />
        <div className="instructions">
          <p>
            <span className="boldFont">Game Instructions</span><br />
            <span>Click on a cell and it will open.</span><br />
            <span>Right click to toggle a flag.</span><br />
            <span>Double click to open cells around the board.</span>
          </p>
          <hr />
          <p className='githublink'>
            <a href="https://github.com/mickell1">Mickell Crawford</a>
            <br />
            <a href="https://github.com/mickell1/Minesweeper"> View Code</a>
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state.game

export default connect(mapStateToProps)(Game)