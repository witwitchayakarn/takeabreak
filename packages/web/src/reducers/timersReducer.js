import {
  INIT, ADD_TIMER, EDIT_TIMER, DELETE_TIMER, MOVE_TIMER_UP, MOVE_TIMER_DOWN,
  IMPORT_DATA, RESET_DATA,
} from '../types/actionTypes';
import { ID } from '../types/const';
import { defaultTimersState } from '../types/defaultStates';
import { swapArrayElements } from '../utils';
import { _ } from '../utils/obj';

const timersReducer = (state = { byId: null, ids: null }, action) => {

  if (action.type === INIT) {
    const { loadedState } = action.payload;
    if (loadedState && loadedState.timers) return loadedState.timers;

    return { ...defaultTimersState };
  }

  if (action.type === ADD_TIMER) {
    const { timer } = action.payload;
    const newState = { ...state };
    newState.byId = { ...newState.byId, [timer.id]: timer };
    newState.ids = [...newState.ids, timer.id];
    return newState;
  }

  if (action.type === EDIT_TIMER) {
    const { timer } = action.payload;
    const newState = { ...state };
    newState.byId = { ...newState.byId, [timer.id]: timer };
    return newState;
  }

  if (action.type === DELETE_TIMER) {
    const { timerId } = action.payload;
    const newState = { ...state };
    newState.byId = _.exclude(newState.byId, ID, timerId);
    newState.ids = newState.ids.filter(_id => _id !== timerId);
    return newState;
  }

  if (action.type === MOVE_TIMER_UP) {
    const id = action.payload;
    const i = state.ids.indexOf(id);
    if (i === -1) {
      console.log(`Error in MOVE_TIMER_UP: id: ${id} not in ${state.ids}`);
      return state;
    }
    if (i === 0) return state;

    const newState = { ...state };
    newState.ids = swapArrayElements(newState.ids, i - 1, i);
    return newState;
  }

  if (action.type === MOVE_TIMER_DOWN) {
    const id = action.payload;
    const length = state.ids.length;
    const i = state.ids.indexOf(id);
    if (i === -1) {
      console.log(`Error in MOVE_TIMER_DOWN: id: ${id} not in ${state.ids}`);
      return state;
    }
    if (i === length - 1) return state;

    const newState = { ...state };
    newState.ids = swapArrayElements(newState.ids, i, i + 1);
    return newState;
  }

  if (action.type === IMPORT_DATA) {
    const { timers } = action.payload;
    return { ...timers };
  }

  if (action.type === RESET_DATA) {
    return { ...defaultTimersState };
  }

  return state;
};

export default timersReducer;
