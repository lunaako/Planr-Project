const GET_CARDS = 'card/get';
const CREATE_CARD = 'card/create';
const UPDATE_CARD = 'card/update';
const DELETE_CARD = 'card/delete';
const REORDER_CARD = 'card/reorder';

const getCards = (payload) => {
  return {
    type: GET_CARDS,
    payload
  }
}

const createCard = (payload) => {
  return {
    type: CREATE_CARD,
    payload
  }
}

const updateCard = (payload) => {
  return {
    type: UPDATE_CARD,
    payload
  }
}

const deleteCard = (payload) => {
  return {
    type: DELETE_CARD,
    payload
  }
}

const reorderCard = (payload) => {
  return {
    type: REORDER_CARD,
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

export const createCardThunk = (csId, newCard) => async(dispatch) => {
  const res = await fetch(`/api/card-sections/${csId}/cards`, {
    method: 'POST',
    body: JSON.stringify(newCard),
    headers: { 'Content-Type': 'application/json' }
  })
  if(res.ok) {
    const data = await res.json()
    dispatch(createCard(data))
    return data
  } else {
    const err = await res.json()
    return err;
  }
}

export const updateCardThunk = (cardId, card) => async(dispatch) => {
  console.log(card)
  const res = await fetch(`/api/cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(card),
    headers: { 'Content-Type': 'application/json' }
  })
  if(res.ok) {
    const data = await res.json()
    dispatch(updateCard(data))
    return data
  } else {
    const err = await res.json()
    return err;
  }
}

export const deleteCardThunk = (cardId) => async(dispatch) => {
  const res = await fetch(`/api/cards/${cardId}`, {
    method: 'DELETE'
  })
  if(res.ok) {
    dispatch(deleteCard(cardId))
    return null;
  } else {
    const err = await res.json()
    return err;
  }
}

export const reorderCardThunk = (reorderCards) => async(dispatch) => {
  const res = await fetch(`/api/cards/reorder`, {
    method: 'PUT',
    body: JSON.stringify(reorderCards),
    headers: { 'Content-Type': 'application/json' }
  })
  if(res.ok) {
    const data = await res.json()
    dispatch(reorderCard(data))
    return data;
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

    case CREATE_CARD: {
      const newState = {...state}
      newState[action.payload.id] = action.payload
      return newState;
    }

    case UPDATE_CARD: {
      const newState = {...state}
      const updatedCard = action.payload
      newState[updatedCard.id] = updatedCard
      return newState;
    }

    case DELETE_CARD: {
      const newState = {...state}
      delete newState[action.payload]
      return newState;
    }

    case REORDER_CARD: {
      const newState = {...state}
      const reorderedCards = action.payload
      reorderedCards.forEach(card => {
        newState[card.id].cardSectionId = card.cardSectionId
        newState[card.id].order = card.order
      })
      return newState;
    }

    default:
      return state;
  }
}

export default cardReducer;