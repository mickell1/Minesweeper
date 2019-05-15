import React from 'react'
import { GiGolfFlag } from 'react-icons/gi'
import { GiClusterBomb } from 'react-icons/gi'
import '../styles/cell.css'

const baseStyle = {
  width: 32,
  height: 32,
  border: 'outset 4px white',
  lineHeight: '32px',
  userSelect: 'none'
}

const openStyle = {
  width: 38,
  height: 38,
  lineHeight: '38px',
  border: 'solid 1px darkgray'
}

export default class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.handleRightClick = this.handleRightClick.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    this.props.onClick(this.props.x, this.props.y)
  }

  handleDoubleClick(e) {
    e.preventDefault()
    this.props.onDoubleClick(this.props.x, this.props.y)
  }

  handleRightClick(e) {
    e.preventDefault()
    this.props.onRightClick(this.props.x, this.props.y)
  }

  render() {
    let content = this.props.cell.flagged ? <GiGolfFlag /> : ''
    let style = Object.assign({}, baseStyle, {
      width: this.props.cellSize - 8,
      height: this.props.cellSize - 8,
      lineHeight: `${this.props.cellSize - 8}px`,
    })
    if (this.props.cell.open) {
      style = Object.assign({}, style, openStyle, {
        width: this.props.cellSize - 2,
        height: this.props.cellSize - 2,
        lineHeight: `${this.props.cellSize - 2}px`
      })
      if (this.props.cell.bomb) {
        content = <GiClusterBomb style={{ marginTop: -3 }} />
        style = Object.assign({}, style, { backgroundColor: 'red' })
      } else {
        if (this.props.cell.bombCount > 0) {
          content = this.props.cell.bombCount
          switch (content) {
            case 1:
              style = Object.assign({}, style, { color: 'blue' })
              break
            case 2:
              style = Object.assign({}, style, { color: 'green' })
              break
            case 3:
              style = Object.assign({}, style, { color: 'red' })
              break
            case 4:
              style = Object.assign({}, style, { color: 'navy' })
              break
            case 5:
              style = Object.assign({}, style, { color: 'darkred' })
              break
            case 6:
              style = Object.assign({}, style, { color: 'deepskyblue' })
              break
            case 7:
              style = Object.assign({}, style, { color: 'navy' })
              break
            case 8:
              style = Object.assign({}, style, { color: 'gray' })
              break
            default:
              break
          }
        } else {
          content = ''
        }
      }
    }
    return (
      <div
        className="cell"
        style={style}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        onContextMenu={this.handleRightClick}
      >
        {content}
      </div>
    )
  }
}