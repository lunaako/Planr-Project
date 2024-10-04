const GET_CARDSECTIONS = 'cardSection/get'


const getCardSections = (payload) => {
  return {
    type: GET_CARDSECTIONS,
    payload
  }
}

export const getCardSectionsThunk = (boardId) => async(dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`)
  if (res.ok) {
    const data = await res.json()
    dispatch(getCardSections(data.CardSections))
    return data;
  } else {
    const err = await res.json()
    return err;
  }
}


function cardSectionReducer(state={}, action) {
  switch(action.type) {

    case GET_CARDSECTIONS: {
      const newState = {...state}
      const cardSecs = action.payload
      cardSecs.forEach(cardSec => {
        if (state[cardSec.id]) {
          newState[cardSec.id] = {...state[cardSec.id], ...cardSec}
        } else {
          newState[cardSec.id] = cardSec
        }
      })
      return newState;
    }

    

    default:
      return state;
  }
}

export default cardSectionReducer;