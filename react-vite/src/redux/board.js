const GET_BOARDS = 'board/get';


const getBoards = (payload) => {
  return {
    type: GET_BOARDS,
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


function boardReducer(state={}, action) {
  switch(action.type) {
    case GET_BOARDS:
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

      
    default:
      return state;
  }
}

export default boardReducer;