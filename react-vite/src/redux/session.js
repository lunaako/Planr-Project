const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const GET_FAVS = 'session/getFavs';
const ADD_FAV = 'session/addFav';
const DELETE_FAV = 'session/deleteFav';
const REMOVE_BOARD_FROM_FAV = 'session/removeBoardFromFav';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const getFavs = (payload) => {
  return {
    type: GET_FAVS,
    payload
  }
}

const addFav = (payload) => {
  return {
    type: ADD_FAV,
    payload
  }
}

const deleteFav = (payload) => {
  return {
    type: DELETE_FAV,
    payload
  }
}

export const removeBoardFromFav = (payload) => {
  return {
    type: REMOVE_BOARD_FROM_FAV,
    payload
  }
}

export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const getFavsThunk = () => async(dispatch) => {
  const res = await fetch('/api/favorites');
  if (res.ok) {
    const data = await res.json();
    dispatch(getFavs(data));
    return data;
  } else {
    const err = await res.json();
    return err;
  }
}

export const addFavThunk = (boardId) => async(dispatch) => {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    body: JSON.stringify(boardId),
    headers: { 'Content-Type': 'application/json' }
  })
  if (res.ok) {
    const data = await res.json();
    dispatch(addFav(data));
    dispatch(getFavsThunk());
    return data;
  } else {
    const err = await res.json();
    return err;
  }
}

export const deleteFavThunk = (favId) => async(dispatch) => {
  const res = await fetch(`/api/favorites/${favId}`, {
    method: 'DELETE'
  })
  if (res.ok) {
    dispatch(deleteFav(favId))
    dispatch(getFavsThunk());
    return null
  } else {
    const err = await res.json()
    return err;
  }
}

const initialState = { user: null, fav: {} };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null, fav: {} };
    
    case GET_FAVS: {
      const newState = {...state}
      const favs = action.payload
      favs.forEach(fav => {
        newState.fav[fav.id] = fav
      })
      return newState;
    }

    case ADD_FAV: {
      const newState = {...state}
      const newFav = action.payload
      newState.fav = {...newState.fav, [newFav.id]: newFav}
      return newState;
    }

    case DELETE_FAV: {
      const newState = {...state}
      const newFav = {...newState.fav};
      delete newFav[action.payload]
      return {...newState, fav: newFav};
    }

    case REMOVE_BOARD_FROM_FAV: {
      const entries = Object.entries(state.fav);
      const filteredEntries = entries.filter(entry => {
        const [favId, favObj] = entry;
        return favObj.boardId !== action.payload
      })
      const newFav = Object.fromEntries(filteredEntries)
      const newState = {user: state.user, fav: newFav}
      return newState
    }

    default:
      return state;
  }
}

export default sessionReducer;
