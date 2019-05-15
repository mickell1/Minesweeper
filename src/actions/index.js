import {
  TOGGLE_FLAG,
  START,
  CHANGE_DIFFICULTY,
  GAMEOVER,
  CLEAR
} from './types'

export const toggle = (flagged) => {
  return {
    type: TOGGLE_FLAG,
    payload: { flagged }
  }
}

export const start = () => {
  return { type: START }
}

export const changeDifficulty = (difficulty) => {
  return {
    type: CHANGE_DIFFICULTY,
    payload: { difficulty }
  }
}

export const gameover = () => {
  return { type: GAMEOVER }
}

export const clear = () => {
  return { type: CLEAR }
}