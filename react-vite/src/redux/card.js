const GET_CARDS = 'card/get';

const getCards = (payload) => {
  return {
    type: GET_CARDS,
    payload
  }
}

export const getCardsThunk = (csId) => async(dispatch) => {
  const res = await fetch(`/api/card-sections/${csId}/cards`)
  if (res.ok) {
    const data = await res.json()
    dispatch(getCards(data.Cards))
    return data
  } else {
    const err = await res.json()
    return err;
  }
}


function cardReducer(state={}, action) {
  switch(action.type) {
    case GET_CARDS: {
      const newState = {...state}
      const cards = action.payload
      cards.forEach(card => {
        if (state[card.id]) {
          newState[card.id] = {...state[card.id], ...card}
        } else {
          newState[card.id] = card
        }
      })
      return newState;
    }


    default:
      return state;
  }
}