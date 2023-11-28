import { apiGetCardList, apiGetTrick, apiGetUser } from "./API";
import { ACTIVE_CARD, ACTIVE_TRICK, SET_USER_TOKEN, GET_TRICK_DATA, SET_USER_DATA, SET_CARD_LIST, SET_OPEN_SNACKBAR } from "./ActionNames";

// used for expandable card animation
export function changeActiveCard(cardName) {
  return (dispatch, getState) => {
    dispatch({
      type: ACTIVE_CARD,
      payload: cardName
    })
  }
};

// used for api call required for the expandable cards carousel
export function changeActiveTrick(activeTrick) {
  return (dispatch, getState) => {
    dispatch(
      {
        type: ACTIVE_TRICK,
        payload: activeTrick,
      }
    )
  }
};

export function setUserToken(user) {
  return (dispatch, getState) => {
    dispatch(
      {
        type: SET_USER_TOKEN,
        payload: user,
      }
    )
  }
};

export function getTrick(trickName, userJwt) {
  return (dispatch, getState) => {
    apiGetTrick(trickName, userJwt).then((response) => {
      let dispatchData = {data: response, trickName}
      dispatch({
        type: GET_TRICK_DATA,
        payload: dispatchData
      })
    }).catch(error => {
      dispatch({
        type: GET_TRICK_DATA,
        payload: [{status:400}]
      })
      dispatch(setSnackBarActive('Could not load trick', true, true))
    })
  }
}

export function getUser(userJwt) {
  return (dispatch, getState) => {
    apiGetUser(userJwt).then((response) => {
      dispatch({
        type: SET_USER_DATA,
        payload: response
      })
    }).catch(error => {
      dispatch(setSnackBarActive('Could not load user', true, true))
      dispatch({
        type: SET_USER_DATA,
        payload: {}
      })
    })
  }
}

export function getCardList(userJwt) {
  return (dispatch, getState) => {
    apiGetCardList(userJwt).then((response) => {
      dispatch({
        type: SET_CARD_LIST,
        payload: response
      })
    }).catch(error => {
      setSnackBarActive('Could not load tricks', true, true)
      dispatch({
        type: SET_CARD_LIST,
        payload: []
      })
    })
  }
}

export function setSnackBarActive (message, open, isError) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_OPEN_SNACKBAR,
      payload: {
        message,
        open,
        isError
      }
    })
  }
}