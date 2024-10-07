const GET_CARDSECTIONS = 'cardSection/get';
const CREATE_CARDSECTION = 'cardSection/create';
const UPDATE_CARDSECTION = 'cardSection/update';
const DELETE_CARDSECTION = 'cardSection/delete';

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

const updateCardSection = (payload) => {
  return {
    type: UPDATE_CARDSECTION,
    payload
  }
}

const deleteCardSection = (payload) => {
  return {
    type: DELETE_CARDSECTION,
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

export const createCardSectionThunk = (boardId, newCs) => async(dispatch) => {
  const res = await fetch(`/api/boards/${boardId}/card-sections`, {
    method: 'POST',
    body: JSON.stringify(newCs),
    headers: { 'Content-Type': 'application/json' }
  })
  if(res.ok) {
    const data = await res.json()
    dispatch(createCardSection(data))
    return data
  } else {
    const err = await res.json()
    return err;
  }
}

export const updateCardSectionThunk = (csId, cs) => async(dispatch) => {
  const res = await fetch(`/api/card-sections/${csId}`, {
    method: 'PUT',
    body: JSON.stringify(cs),
    headers: { 'Content-Type': 'application/json' }
  })
  if (res.ok) {
    const data = await res.json()
    dispatch(updateCardSection(data))
    return data
  } else {
    const err = await res.json()
    return err;     
  }
}

export const deleteCardSectionThunk = (csId) => async(dispatch) => {
  const res = await fetch(`/api/card-sections/${csId}`, {
    method: 'DELETE'
  })
  if(res.ok) {
    dispatch(deleteCardSection(csId))
    return null
  } else {
    const err = await res.json()
    return err;   
  }
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

    case UPDATE_CARDSECTION: {
      const newState = {...state}
      const updatedCs = action.payload
      newState[updatedCs.id] = updatedCs
      return newState;
    }

    case DELETE_CARDSECTION: {
      const newState = {...state}
      delete newState[action.payload]
      return newState;
    }

    case CREATE_CARDSECTION: {
      const newState = {...state}
      newState[action.payload.id] = action.payload
      return newState;
    }


    default:
      return state;
  }
}

export default cardSectionReducer;