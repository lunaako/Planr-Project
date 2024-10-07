const GET_CARDSECTIONS = 'cardSection/get';
const CREATE_CARDSECTION = 'cardSection/create';

const getCardSections = (payload) => {
  return {
    type: GET_CARDSECTIONS,
    payload
  }
}

const createCardSection = (payload) => {
  return {
    type: CREATE_CARDSECTION,
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

export const createCardSectionThunk = () => async(dispatch) => {

}


function cardSectionReducer(state={}, action) {
  switch(action.type) {

    case GET_CARDSECTIONS: {
      const newState = {}
      const cardSecs = action.payload
      if (!cardSecs.length) return newState
      cardSecs.forEach(cardSec => {
          newState[cardSec.id] = cardSec
      })
      return newState;
    }


    default:
      return state;
  }
}

export default cardSectionReducer;