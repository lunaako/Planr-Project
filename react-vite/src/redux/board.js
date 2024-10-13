import { removeBoardFromFav } from "./session";

const GET_BOARDS = 'board/get';
const GET_BOARD = 'board/getOne';
const UPDATE_BOARD = 'board/update';
const DELETE_BOARD = 'board/delete';
const CREATE_BOARD = 'board/create';

const getBoards = (payload) => {
  return {
    type: GET_BOARDS,
    payload
  }
}

const getBoard = (payload) => {
  return {
    type: GET_BOARD,
    payload
  }
}

const updateBoard = (payload) => {
  return {
    type: UPDATE_BOARD,
    payload
  }
}

const createBoard = (payload) => {
  return {
    type: CREATE_BOARD,
    payload
  }
}

const deleteBoard = (payload) => {
  return {
    type: DELETE_BOARD,
    payload
  }
}

export const getBoardsThunk = () => async(dispatch) => {
  const res = await fetch('/api/boards/current');
  if(res.ok) {
    const data = await res.json()
    dispatch(getBoards(data.Boards))
    return data
  } else {
    const err = await res.json()
    return err
  }
}

export const getBoardThunk = (boardId) => async(dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`);
  if(res.ok) {
    const data = await res.json();
    dispatch(getBoard(data))
    return data
  } else {
    const err = await res.json()
    return err;
  }
}

export const updateBoardThunk = (boardId, board) => async(dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`, {
    method: 'PUT',
    body: JSON.stringify(board),
    headers: { 'Content-Type': 'application/json' }
  })
  if (res.ok) {
    const data = await res.json()
    dispatch(updateBoard(data))
    return data;
  } else {
    const err = await res.json()
    return err;    
  }
}

export const createBoardThunk = (newBoard) => async(dispatch) => {
  const res = await fetch('/api/boards', {
    method: 'POST',
    body: JSON.stringify(newBoard),
    headers: { 'Content-Type': 'application/json' }
  })
  if (res.ok) {
    const data = await res.json()
    dispatch(createBoard(data))
    return data
  } else {
    const err = await res.json()
    return err;
  }
}

export const deleteBoardThunk = (boardId) => async(dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`, {
    method: 'DELETE'
  })
  if (res.ok) {
    dispatch(deleteBoard(boardId))
    dispatch(removeBoardFromFav(boardId))
    return null
  } else {
    const err = await res.json()
    return err;
  }
}


function boardReducer(state={}, action) {
  switch(action.type) {

    case GET_BOARDS: {
      const newState = {...state}
      const boards = action.payload
      boards.forEach(board => {
        if (state[board.id]) {
          newState[board.id] = {...state[board.id], ...board}
        } else {
          newState[board.id] = board
        }
      })
      return newState;
    }

    case GET_BOARD: {
      const newState = {...state}
      const detailBoard = action.payload
      if (state[detailBoard.id]) {
        newState[detailBoard.id] = {...state[detailBoard.id], ...detailBoard}
      } else {
        newState[detailBoard] = detailBoard
      }
      return newState;
    }

    case UPDATE_BOARD: {
      const newState = {...state}
      const updatedBoard = action.payload
      newState[updatedBoard.id] = updatedBoard
      return newState;
    }

    case CREATE_BOARD: {
      const newState = {...state}
      newState[action.payload.id] = action.payload
      return newState;
    }

    case DELETE_BOARD: {
      const newState = {...state}
      delete newState[action.payload]
      return newState;
    }


    default:
      return state;
  }
}

export default boardReducer;