import { combineReducers } from 'redux-loop';

import windowReducer from './windowReducer';
import timersReducer from './timersReducer';
import timerRemindersReducer from './timerRemindersReducer';
import displayReducer from './displayReducer';
import editorReducer from './editorReducer';
import editorRemindersReducer from './editorRemindersReducer';

const reducers = combineReducers({
  window: windowReducer,
  timers: timersReducer,
  timerReminders: timerRemindersReducer,
  display: displayReducer,
  editor: editorReducer,
  editorReminders: editorRemindersReducer,
});

export default reducers;
