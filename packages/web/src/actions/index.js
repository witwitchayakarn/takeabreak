import { load as loadRedux } from "redux-localstorage-simple";
import Url from 'url-parse';
import { saveAs } from 'file-saver';

import {
  INIT, UPDATE_WINDOW_SIZE, UPDATE_POPUP, UPDATE_TOOLTIP,
  UPDATE_RUNNING_TIMER_ID, UPDATE_RUNNING_FLAG, DECREASE_RUNNING_DURATION,
  UPDATE_SELECTING_TIMER_ID, INIT_EDITOR, UPDATE_EDITOR_IS_MORE_SETTINGS_SHOWN,
  UPDATE_EDITOR_NAME, UPDATE_EDITOR_DURATION, UPDATE_EDITOR_REMINDER_MESSAGE,
  UPDATE_EDITOR_REMINDER_CUSTOM_MESSAGE, UPDATE_EDITOR_REMINDER_MESSAGE_DISPLAY_DURATION,
  UPDATE_EDITOR_REMINDER_CUSTOM_MESSAGE_DISPLAY_DURATION, UPDATE_EDITOR_REMINDER_SOUND,
  UPDATE_EDITOR_REMINDER_REPETITIONS, UPDATE_EDITOR_REMINDER_INTERVAL,
  UPDATE_EDITOR_NEXT_TIMER_ID, UPDATE_EDITOR_NEXT_TIMER_STARTS_BY,
  UPDATE_EDITOR_SELECTING_REMINDER_KEY, UPDATE_EDITOR_REMINDER_IS_MORE_OPTIONS_SHOWN,
  ADD_TIMER, EDIT_TIMER, DELETE_TIMER, MOVE_TIMER_UP, MOVE_TIMER_DOWN,
  ADD_EDITOR_REMINDER, DELETE_EDITOR_REMINDER,
  MOVE_EDITOR_REMINDER_UP, MOVE_EDITOR_REMINDER_DOWN,
  IMPORT_DATA, RESET_DATA,
} from '../types/actionTypes';
import {
  TIMER_ITEM_MENU_POPUP, EDITOR_POPUP, EDITOR_REMINDER_MENU_POPUP,
  CONFIRM_DELETE_POPUP, CONFIRM_DISCARD_POPUP,
  MESSAGE_KEY, MESSAGE_DISPLAY_DURATION_KEY, DEFAULT, CUSTOM, NONE, AUTO,
} from '../types/const';
import { SOUNDS } from '../types/soundPaths';
import { defaultEditorState } from "../types/defaultStates";
import {
  throttle, urlHashToObj, objToUrlHash, getMMSS, isEqual, isNotificationSupported,
} from '../utils';

import logo from '../images/logo-short.svg';

export const init = () => async (dispatch, getState) => {

  handleUrlHash();

  const loadedState = loadRedux();
  dispatch({
    type: INIT,
    payload: {
      loadedState,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    },
  });

  // Let hash get updated first before add an listener
  setTimeout(() => {
    window.addEventListener('hashchange', function (e) {
      onUrlHashChange(e.oldURL, e.newURL, dispatch, getState);
    });
  }, 1);

  window.addEventListener('resize', throttle(() => {
    dispatch({
      type: UPDATE_WINDOW_SIZE,
      payload: {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      },
    });
  }, 16));

  window.addEventListener('beforeunload', (e) => {
    console.log('beforeunload is called.')
  }, { capture: true });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      // The tab has become visible so clear the now-stale Notification.

    }
  });
};

export const handleUrlHash = () => {
  const urlObj = new Url(window.location.href, {});
  if (urlObj.hash !== '') {
    urlObj.set('hash', '');
    window.location.replace(urlObj.toString());
  }
};

export const onUrlHashChange = (oldUrl, newUrl, dispatch, getState) => {

  const oldUrlObj = new Url(oldUrl, {});
  const oldHashObj = urlHashToObj(oldUrlObj.hash);

  const newUrlObj = new Url(newUrl, {});
  const newHashObj = urlHashToObj(newUrlObj.hash);

  // Popup
  if ('p' in oldHashObj && 'p' in newHashObj) {
    if (oldHashObj['p'] === newHashObj['p']) {
      // something else changed, do nothing here.
    } else {
      // i.e. from profilePopup to settingsPopup
      dispatch(updatePopup(oldHashObj['p'], false, null));

      let anchorPosition = null;
      if (newHashObj['ppt']) anchorPosition = {
        x: parseInt(newHashObj['ppx']),
        y: parseInt(newHashObj['ppy']),
        width: parseInt(newHashObj['ppw']),
        height: parseInt(newHashObj['pph']),
        top: parseInt(newHashObj['ppt']),
        right: parseInt(newHashObj['ppr']),
        bottom: parseInt(newHashObj['ppb']),
        left: parseInt(newHashObj['ppl']),
      }
      dispatch(updatePopup(newHashObj['p'], true, anchorPosition));
    }
  } else if ('p' in oldHashObj && !('p' in newHashObj)) {
    // Close popup
    dispatch(updatePopup(oldHashObj['p'], false, null));
  } else if (!('p' in oldHashObj) && 'p' in newHashObj) {
    // Open popup
    let anchorPosition = null;
    if (newHashObj['ppt']) anchorPosition = {
      x: parseInt(newHashObj['ppx']),
      y: parseInt(newHashObj['ppy']),
      width: parseInt(newHashObj['ppw']),
      height: parseInt(newHashObj['pph']),
      top: parseInt(newHashObj['ppt']),
      right: parseInt(newHashObj['ppr']),
      bottom: parseInt(newHashObj['ppb']),
      left: parseInt(newHashObj['ppl']),
    }
    dispatch(updatePopup(newHashObj['p'], true, anchorPosition));
  }

  // editor popup
  if ('ep' in oldHashObj && 'ep' in newHashObj) {
    if (oldHashObj['ep'] === newHashObj['ep']) {
      // something else changed, do nothing here.
    } else {
      throw new Error(`Shouldn't reach here!`);
    }
  } else if ('ep' in oldHashObj && !('ep' in newHashObj)) {
    // Close editor popup
    dispatch(updatePopup(EDITOR_POPUP, false, null));
  } else if (!('ep' in oldHashObj) && 'ep' in newHashObj) {
    // Open editor popup
    dispatch(updatePopup(EDITOR_POPUP, true, null));
  }

  // confirm delete popup
  if ('cdp' in oldHashObj && 'cdp' in newHashObj) {
    if (oldHashObj['cdp'] === newHashObj['cdp']) {
      // something else changed, do nothing here.
    } else {
      throw new Error(`Shouldn't reach here!`);
    }
  } else if ('cdp' in oldHashObj && !('cdp' in newHashObj)) {
    // Close confirm delete popup
    dispatch(updatePopup(CONFIRM_DELETE_POPUP, false, null));
  } else if (!('cdp' in oldHashObj) && 'cdp' in newHashObj) {
    // Open confirm delete popup
    dispatch(updatePopup(CONFIRM_DELETE_POPUP, true, null));
  }

  // confirm discard popup
  if ('cdip' in oldHashObj && 'cdip' in newHashObj) {
    if (oldHashObj['cdip'] === newHashObj['cdip']) {
      // something else changed, do nothing here.
    } else {
      throw new Error(`Shouldn't reach here!`);
    }
  } else if ('cdip' in oldHashObj && !('cdip' in newHashObj)) {
    // Close confirm discard popup
    dispatch(updatePopup(CONFIRM_DISCARD_POPUP, false, null));
  } else if (!('cdip' in oldHashObj) && 'cdip' in newHashObj) {
    // Open confirm discard popup
    dispatch(updatePopup(CONFIRM_DISCARD_POPUP, true, null));
  }
};

export const updateUrlHash = (q, doReplace = false) => {
  const hashObj = { ...urlHashToObj(window.location.hash), ...q };
  const updatedHash = objToUrlHash(hashObj);

  if (doReplace) {
    const urlObj = new Url(window.location.href, {});
    urlObj.set('hash', updatedHash);
    window.location.replace(urlObj.toString());
  } else window.location.hash = updatedHash;
};

export const updatePopupUrlHash = (id, isShown, anchorPosition, doReplace = false) => {
  if (!isShown) {
    window.history.back();
    return;
  }

  // editorPopup, confirmDeletePopup, and confirmDiscardpopup
  //   uses diff key because can display together with others
  let obj;
  if (id === EDITOR_POPUP) obj = { ep: true };
  else if (id === CONFIRM_DELETE_POPUP) obj = { cdp: true };
  else if (id === CONFIRM_DISCARD_POPUP) obj = { cdip: true };
  else {
    obj = {
      p: id,
      ppx: anchorPosition ? Math.round(anchorPosition.x) : null,
      ppy: anchorPosition ? Math.round(anchorPosition.y) : null,
      ppw: anchorPosition ? Math.round(anchorPosition.width) : null,
      pph: anchorPosition ? Math.round(anchorPosition.height) : null,
      ppt: anchorPosition ? Math.round(anchorPosition.top) : null,
      ppr: anchorPosition ? Math.round(anchorPosition.right) : null,
      ppb: anchorPosition ? Math.round(anchorPosition.bottom) : null,
      ppl: anchorPosition ? Math.round(anchorPosition.left) : null,
    };
  }
  updateUrlHash(obj, doReplace);
};

export const updatePopup = (id, isShown, anchorPosition) => {
  return {
    type: UPDATE_POPUP,
    payload: { id, isShown, anchorPosition },
  };
};

export const updateTooltip = (id, isShown, anchorPosition) => {
  return {
    type: UPDATE_TOOLTIP,
    payload: { id, isShown, anchorPosition },
  };
};

export const updateRunningTimerId = (id) => async (dispatch, getState) => {
  const duration = id ? getState().timers.byId[id].duration : null;
  dispatch({
    type: UPDATE_RUNNING_TIMER_ID,
    payload: { timerId: id, timerDuration: duration },
  });
};

export const updateRunningFlag = (flag) => {
  return { type: UPDATE_RUNNING_FLAG, payload: flag };
};

export const decreaseRunningDuration = (amount = 1) => {
  return { type: DECREASE_RUNNING_DURATION, payload: amount };
};

export const updateSelectingTimerId = (id) => {
  return { type: UPDATE_SELECTING_TIMER_ID, payload: id };
};

export const moveTimerUp = () => async (dispatch, getState) => {
  const id = getState().display.selectingTimerId;
  dispatch({ type: MOVE_TIMER_UP, payload: id });
};

export const moveTimerDown = () => async (dispatch, getState) => {
  const id = getState().display.selectingTimerId;
  dispatch({ type: MOVE_TIMER_DOWN, payload: id });
};

const toEditorState = (timer, getState) => {
  const editorState = { ...timer, duration: getMMSS(timer.duration) };
  editorState.reminders = editorState.reminders.map(id => {
    const reminder = getState().timerReminders.byId[id]

    let rMesage = DEFAULT, rCustomMessage = '';
    if (reminder.message !== null) {
      rMesage = CUSTOM;
      rCustomMessage = reminder.message;
    }

    let rMessageDisplayDuration = DEFAULT, rCustomMessageDisplayDuration = '';
    if (reminder.messageDisplayDuration !== null) {
      rMessageDisplayDuration = CUSTOM;
      rCustomMessageDisplayDuration = reminder.messageDisplayDuration;
    }

    let rSound = DEFAULT;
    if (reminder.sound !== null) {
      rSound = reminder.sound
    }

    return {
      ...reminder, message: rMesage, customMessage: rCustomMessage,
      messageDisplayDuration: rMessageDisplayDuration,
      customMessageDisplayDuration: rCustomMessageDisplayDuration, sound: rSound,
    };
  });
  return editorState;
};

export const showEditor = (isNew) => async (dispatch, getState) => {
  let editorState;
  if (isNew) editorState = defaultEditorState;
  else {
    const timerId = getState().display.selectingTimerId;
    const timer = getState().timers.byId[timerId];
    editorState = toEditorState(timer, getState);
  }

  dispatch({ type: INIT_EDITOR, payload: editorState });
  updatePopupUrlHash(EDITOR_POPUP, true, null);
};

export const hideEditor = (doCheckEditing = false) => async (dispatch, getState) => {
  if (!doCheckEditing) updatePopupUrlHash(EDITOR_POPUP, false, null);

  const {
    id, name, duration, reminderMessage, reminderMessageDisplayDuration, reminderSound,
    reminders, nextTimerId, nextTimerStartsBy,
  } = getState().editor;

  const remindersState = reminders.map(reminder => {
    return {
      id: reminder.id,
      repetitions: reminder.repetitions,
      interval: reminder.interval,
      message: reminder.message,
      customMessage: reminder.customMessage,
      messageDisplayDuration: reminder.messageDisplayDuration,
      customMessageDisplayDuration: reminder.customMessageDisplayDuration,
      sound: reminder.sound,
    };
  });

  const editorState = {
    id, name, duration, reminderMessage, reminderMessageDisplayDuration, reminderSound,
    reminders: remindersState, nextTimerId, nextTimerStartsBy,
  }

  let didChange;
  if (id === null) didChange = !isEqual(defaultEditorState, editorState);
  else {
    const timerId = getState().display.selectingTimerId;
    const timer = getState().timers.byId[timerId];
    didChange = !isEqual(toEditorState(timer, getState), editorState);
  }

  if (didChange) updatePopupUrlHash(CONFIRM_DISCARD_POPUP, true, null);
  else updatePopupUrlHash(EDITOR_POPUP, false, null);
};

export const updateEditorIsMoreSettingsShown = (isShown) => {
  return { type: UPDATE_EDITOR_IS_MORE_SETTINGS_SHOWN, payload: isShown };
};

export const updateEditorName = (name) => async (dispatch, getState) => {
  const didReminderMessageTouch = getState().editor.didReminderMessageTouch;

  let reminderMessage = null;
  if (!didReminderMessageTouch) {
    if (name === '') reminderMessage = '';
    else reminderMessage = `${name} has ended.`;
  }

  dispatch({ type: UPDATE_EDITOR_NAME, payload: { name, reminderMessage } });
};

export const updateEditorDuration = (duration) => async (dispatch, getState) => {

  if (/^[0-9]+::+$/.test(duration)) duration = duration.replace(/:+/, ':');

  let msg = null;
  if (duration.length > 0) {
    const isF1 = /^[0-9]+$/.test(duration);
    const isF2 = /^[0-9]+:$/.test(duration);
    const isF3 = /^[0-9]+:[0-9]+$/.test(duration);

    if (!isF1 && !isF2 && !isF3) {
      msg = 'Please fill in a number of minutes, then \':\' and a number of seconds i.e. 07:28';
    } else if (isF1 && !isF2 && !isF3) {
      const _duration = getState().editor.duration;
      if (duration.length === 2 && _duration.length === 1) {
        duration += ':';
      }
    }
  }

  dispatch({ type: UPDATE_EDITOR_DURATION, payload: { duration, msg } });
};

export const updateEditorReminderMessage = (msg, key = null) => {
  return { type: UPDATE_EDITOR_REMINDER_MESSAGE, payload: { msg, key } };
};

export const updateEditorReminderCustomMessage = (msg, key = null) => {
  return { type: UPDATE_EDITOR_REMINDER_CUSTOM_MESSAGE, payload: { msg, key } };
};

export const updateEditorReminderMessageDisplayDuration = (duration, key = null) => {

  let msg = null;
  if (duration.length > 0) {
    if (!/^[0-9]+$/.test(duration)) msg = 'Please fill in a number i.e. 10';
  }

  return {
    type: UPDATE_EDITOR_REMINDER_MESSAGE_DISPLAY_DURATION,
    payload: { duration, msg, key },
  };
};

export const updateEditorReminderCustomMessageDisplayDuration = (
  duration, key = null
) => {

  let msg = null;
  if (duration.length > 0) {
    if (!/^[0-9]+$/.test(duration)) msg = 'Please fill in a number i.e. 10';
  }

  return {
    type: UPDATE_EDITOR_REMINDER_CUSTOM_MESSAGE_DISPLAY_DURATION,
    payload: { duration, msg, key },
  };
};

export const updateEditorReminderSound = (sound) => async (dispatch, getState) => {
  const key = getState().editor.selectingReminderKey;
  dispatch({ type: UPDATE_EDITOR_REMINDER_SOUND, payload: { sound, key } });
};

export const updateEditorReminderRepetitions = (repetitions, key) => {

  let msg = null;
  if (repetitions.length > 0) {
    if (!/^[0-9]+$/.test(repetitions)) msg = 'Please fill in a number i.e. 2';
  }

  return {
    type: UPDATE_EDITOR_REMINDER_REPETITIONS, payload: { repetitions, msg, key }
  };
};

export const updateEditorReminderInterval = (interval, key) => {

  let msg = null;
  if (interval.length > 0) {
    if (!/^[0-9]+$/.test(interval)) msg = 'Please fill in a number i.e. 2';
  }

  return { type: UPDATE_EDITOR_REMINDER_INTERVAL, payload: { interval, msg, key } };
};

export const updateEditorNextTimerId = (id) => {
  return { type: UPDATE_EDITOR_NEXT_TIMER_ID, payload: id };
};

export const updateEditorNextTimerStartsBy = (value) => {
  return { type: UPDATE_EDITOR_NEXT_TIMER_STARTS_BY, payload: value };
};

export const updateEditorDefault = (value) => async (dispatch, getState) => {
  const key = getState().editor.selectingReminderKey;
  const [reminderKey, inputKey] = key.split('/');

  if (inputKey === MESSAGE_KEY) {
    dispatch(updateEditorReminderMessage(value, reminderKey));
  } else if (inputKey === MESSAGE_DISPLAY_DURATION_KEY) {
    dispatch(updateEditorReminderMessageDisplayDuration(value, reminderKey));
  } else throw new Error(`Invalid inputKey: ${inputKey}`);
};

export const updateEditorSelectingReminderKey = (key) => {
  return { type: UPDATE_EDITOR_SELECTING_REMINDER_KEY, payload: key };
};

export const updateEditorReminderIsMoreOptionsShown = (isShown) => async (
  dispatch, getState
) => {
  const key = getState().editor.selectingReminderKey;
  dispatch({
    type: UPDATE_EDITOR_REMINDER_IS_MORE_OPTIONS_SHOWN,
    payload: { isShown, key },
  })
};

export const addEditorReminder = () => {
  return { type: ADD_EDITOR_REMINDER };
};

export const moveEditorReminderUp = () => async (dispatch, getState) => {
  const key = getState().editor.selectingReminderKey;
  dispatch({ type: MOVE_EDITOR_REMINDER_UP, payload: key });
};

export const moveEditorReminderDown = () => async (dispatch, getState) => {
  const key = getState().editor.selectingReminderKey;
  dispatch({ type: MOVE_EDITOR_REMINDER_DOWN, payload: key });
};

export const confirmDelete = () => async (dispatch, getState) => {
  let isShown;

  isShown = getState().display.isTimerItemMenuPopupShown;
  if (isShown) {
    const timerId = getState().display.selectingTimerId;
    const reminderIds = getState().timers.byId[timerId].reminders;
    dispatch({ type: DELETE_TIMER, payload: { timerId, reminderIds } });
    updatePopupUrlHash(TIMER_ITEM_MENU_POPUP, false, null);
    return;
  }

  isShown = getState().display.isEditorReminderMenuPopupShown;
  if (isShown) {
    const key = getState().editor.selectingReminderKey;
    dispatch({ type: DELETE_EDITOR_REMINDER, payload: key });
    updatePopupUrlHash(EDITOR_REMINDER_MENU_POPUP, false, null);
    return;
  }

  throw new Error(`Invalid isShown: ${isShown}`);
};

export const saveTimer = () => async (dispatch, getState) => {

  const {
    id, name, duration, reminderMessage, reminderMessageDisplayDuration, reminderSound,
    reminders, nextTimerId, nextTimerStartsBy,
  } = getState().editor;

  // validation
  if (!/^[0-9]+:[0-9]+$/.test(duration)) {
    const msg = 'Please fill in a number of minutes, then \':\' and a number of seconds i.e. 07:28';
    dispatch({ type: UPDATE_EDITOR_DURATION, payload: { duration, msg } });
    return;
  }
  if (!/^[0-9]+$/.test(reminderMessageDisplayDuration)) {
    const msg = 'Please fill in a number i.e. 10';
    dispatch({
      type: UPDATE_EDITOR_REMINDER_MESSAGE_DISPLAY_DURATION,
      payload: { duration: reminderMessageDisplayDuration, msg },
    });
    return;
  }

  let hasInvalid = false;
  for (const reminder of reminders) {
    if (!/^[0-9]+$/.test(reminder.repetitions)) {
      const msg = 'Please fill in a number i.e. 2';
      dispatch({
        type: UPDATE_EDITOR_REMINDER_REPETITIONS,
        payload: { repetitions: reminder.repetitions, msg, key: reminder.key },
      });
      hasInvalid = true;
    }
    if (!/^[0-9]+$/.test(reminder.interval)) {
      const msg = 'Please fill in a number i.e. 2';
      dispatch({
        type: UPDATE_EDITOR_REMINDER_INTERVAL,
        payload: { interval: reminder.interval, msg, key: reminder.key },
      });
      hasInvalid = true;
    }
    if (reminder.messageDisplayDuration !== DEFAULT) {
      if (!/^[0-9]+$/.test(reminder.customMessageDisplayDuration)) {
        const msg = 'Please fill in a number i.e. 10';
        dispatch({
          type: UPDATE_EDITOR_REMINDER_CUSTOM_MESSAGE_DISPLAY_DURATION,
          payload: {
            duration: reminder.customMessageDisplayDuration, msg, key: reminder.key,
          },
        });
        hasInvalid = true;
      }
    }
  }
  if (hasInvalid) return;

  // convert to timerState and reminderState
  let now = Date.now();
  const tId = id ? id : `t${now++}`;

  const [mm, ss] = duration.split(':');
  const tDuration = parseInt(mm, 10) * 60 + parseInt(ss, 10);
  const tReminderMessageDisplayDuration = parseInt(reminderMessageDisplayDuration, 10);

  const timerReminders = reminders.map(reminder => {
    const rId = reminder.id ? reminder.id : `r${now++}`;
    const rRepetitions = parseInt(reminder.repetitions, 10);
    const rInterval = parseInt(reminder.interval, 10);
    const rMessage = reminder.message === DEFAULT ? null : reminder.customMessage;

    let rMessageDisplayDuration = null;
    if (reminder.messageDisplayDuration !== DEFAULT) {
      rMessageDisplayDuration = reminder.customMessageDisplayDuration;
    }

    const rSound = reminder.sound === DEFAULT ? null : reminder.sound;

    return {
      id: rId, repetitions: rRepetitions, interval: rInterval, message: rMessage,
      messageDisplayDuration: rMessageDisplayDuration, sound: rSound,
    };
  });
  const tReminders = timerReminders.map(reminder => reminder.id);

  const timer = {
    id: tId, name, duration: tDuration, reminderMessage,
    reminderMessageDisplayDuration: tReminderMessageDisplayDuration,
    reminderSound, reminders: tReminders, nextTimerId, nextTimerStartsBy,
  };

  // Dispatch to add a new Timer or edit an existing timer
  if (id) dispatch({ type: EDIT_TIMER, payload: { timer, reminders: timerReminders } })
  else dispatch({ type: ADD_TIMER, payload: { timer, reminders: timerReminders } })

  updatePopupUrlHash(EDITOR_POPUP, false, null);
};

let prevFireIndex = -1;
let didStopFire = false;
let reminderTimeoutId = null;
let soundIntervalId = null;
let notification = null;
let notiTimeoutId = null;
const _fireReminders = async (fireIndex, dispatch, getState) => {
  if (fireIndex === prevFireIndex) console.warn(`Got same fireIndex: ${fireIndex}`);

  const { runningTimerId } = getState().display;
  const {
    reminderMessage, reminderMessageDisplayDuration, reminderSound,
    reminders: reminderIds, nextTimerId, nextTimerStartsBy,
  } = getState().timers.byId[runningTimerId];
  const reminders = reminderIds.map(id => getState().timerReminders.byId[id]);
  const reminder = reminders[fireIndex];

  // Play sound
  const _reps = reminder.repetitions;
  if (_reps > 0) {
    const _sound = reminder.sound === null ? reminderSound : reminder.sound;
    const sound = SOUNDS.find(sound => sound.name === _sound);
    if (sound) {
      let count = 0;

      const audio = new Audio(sound.path);
      audio.addEventListener("canplaythrough", () => audio.play());
      count += 1;

      if (count < _reps) {
        if (soundIntervalId) {
          console.warn('Needed to clear previous active sound interval!');
          clearInterval(soundIntervalId);
        }
        soundIntervalId = setInterval(() => {
          const audio = new Audio(sound.path);
          audio.addEventListener("canplaythrough", () => audio.play());
          count += 1;
          if (count === _reps) {
            clearInterval(soundIntervalId);
            soundIntervalId = null;
          }
        }, sound.interval * 1000);
      }
    }
  }

  // Send notification
  let _dur = reminderMessageDisplayDuration;
  if (reminder.messageDisplayDuration !== null) _dur = reminder.messageDisplayDuration;
  if (_dur > 0 && isNotificationSupported()) {
    const titleMsg = reminder.message === null ? reminderMessage : reminder.message;

    let bodyMsg = 'Just now.';
    if (fireIndex > 0) {
      let cumDur = 0;
      for (let i = 1; i <= fireIndex; i++) cumDur += reminders[i].interval;

      const mins = Math.floor(cumDur / 60);
      const seconds = cumDur % 60;

      bodyMsg = '';
      if (mins > 0) bodyMsg += `${mins} minutes `;
      if (seconds > 0) bodyMsg += `${seconds} seconds `;
      bodyMsg += 'ago.';
    }

    if (Notification.permission === 'default') await Notification.requestPermission();

    if (didStopFire) return;
    if (Notification.permission === 'granted') {
      if (notification) {
        console.warn('Needed to clear previous active notification!');
        notification.close();
      }
      if (notiTimeoutId) {
        console.warn('Needed to clear previous active noti timeout!');
        clearTimeout(notiTimeoutId);
      }
      notification = new Notification(titleMsg, {
        icon: logo, body: bodyMsg, renotify: true, tag: 'TAKEABREAK_TIME_UP',
        requireInteraction: true, silent: true,
      });
      notification.onclick = () => {
        dispatch(stopFireReminders());
      };
      notiTimeoutId = setTimeout(() => {
        if (notification) notification.close();
        notification = null;
        notiTimeoutId = null;
      }, _dur * 1000);
    }
  }

  // Fire next reminder
  if (fireIndex < reminders.length - 1) {
    const _interval = reminders[fireIndex + 1].interval;
    if (reminderTimeoutId) {
      console.warn('Needed to clear previous active reminder timeout!');
      clearTimeout(reminderTimeoutId);
    }
    reminderTimeoutId = setTimeout(() => {
      reminderTimeoutId = null;
      _fireReminders(fireIndex + 1, dispatch, getState);
    }, _interval * 1000);

    prevFireIndex = fireIndex;
    return;
  }

  prevFireIndex = -1;

  // Last reminder, check nextTimerId and nextTimerStartsBy
  if (nextTimerId !== NONE && nextTimerStartsBy === AUTO) {
    dispatch(updateRunningTimerId(null));
    setTimeout(() => dispatch(updateRunningTimerId(nextTimerId)), 100);
  }
};

export const fireReminders = () => async (dispatch, getState) => {
  didStopFire = false;
  _fireReminders(0, dispatch, getState);
};

export const stopFireReminders = () => async (dispatch, getState) => {
  clearTimeout(reminderTimeoutId);
  reminderTimeoutId = null;

  clearInterval(soundIntervalId);
  soundIntervalId = null;

  clearTimeout(notiTimeoutId);
  notiTimeoutId = null;

  if (notification) notification.close();
  notification = null;

  prevFireIndex = -1;
  didStopFire = true;
  dispatch(updateRunningTimerId(null));
};

export const runNextTimer = () => async (dispatch, getState) => {
  const { runningTimerId } = getState().display;
  const { nextTimerId } = getState().timers.byId[runningTimerId];

  dispatch(stopFireReminders());
  dispatch(updateRunningTimerId(nextTimerId));
};

export const importData = () => async (dispatch, getState) => {

  const onError = () => {
    window.alert('Import failed: could not parse content in the file. Please recheck your file.');
  };

  const onReaderLoad = (e) => {
    const text = e.target.result;
    try {
      const state = JSON.parse(text);
      if (!state || !state.timers || !state.timerReminders) {
        onError();
        return;
      }

      dispatch({ type: IMPORT_DATA, payload: state });
    } catch (e) {
      onError();
    }
  };

  const onInputChange = () => {
    if (input.files) {
      const reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.onerror = onError;
      reader.readAsText(input.files[0]);
    }
  };

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt, .json';
  input.addEventListener('change', onInputChange);
  input.click();
};

export const exportData = () => async (dispatch, getState) => {
  const data = getState();
  var blob = new Blob([JSON.stringify(data)], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "takeabreak-data.txt");
};

export const resetData = () => {
  return { type: RESET_DATA };
};
