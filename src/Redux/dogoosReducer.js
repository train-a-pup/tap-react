import { combineReducers } from 'redux';
import { ACTIVE_CARD, ACTIVE_TRICK, SET_USER_TOKEN, GET_TRICK_DATA, SET_USER_DATA, SET_CARD_LIST, SET_OPEN_SNACKBAR } from './ActionNames';

const INITIAL_STATE = {
  activeCard: "",
  activeTrick: {},
  trickData: [],
  user: {},
  userToken: "",
  cardList: [],
  snackbarData: {}
};

const doggosReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIVE_CARD:
      return {
        ...state,
        activeCard: action.payload
      }
    case ACTIVE_TRICK:
      return {
        ...state,
        activeTrick: action.payload
      }
    case GET_TRICK_DATA:
      return {
        ...state,
        trickData: action.payload
      }
    case SET_USER_TOKEN:
      return {
        ...state,
        userToken: action.payload
      }
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload
      }
    case SET_CARD_LIST: 
      return {
        ...state,
        cardList: action.payload
      }
    case SET_OPEN_SNACKBAR: 
      return {
        ...state,
        snackbarData: action.payload
      }
    default:
      return state
  }
};

export default combineReducers({
  tap: doggosReducer
});