import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import {
  updatePopupUrlHash, updateEditorSelectingReminderKey,
  updateEditorReminderCustomMessage, updateEditorReminderCustomMessageDisplayDuration,
  updateEditorReminderRepetitions, updateEditorReminderInterval,
} from '../actions';
import {
  EDITOR_DEFAULT_MENU_POPUP, EDITOR_REMINDER_SOUND_MENU_POPUP,
  EDITOR_REMINDER_MENU_POPUP, MESSAGE_KEY, MESSAGE_DISPLAY_DURATION_KEY,
  DEFAULT,
} from '../types/const';
import { SOUNDS } from '../types/soundPaths';

const EditorReminderItem = (props) => {

  const { seq, reminder } = props;
  const menuBtn = useRef(null);
  const messageBtn = useRef(null);
  const messageDisplayDurationBtn = useRef(null);
  const soundBtn = useRef(null);
  const dispatch = useDispatch();

  const onRepetitionsInputChange = (e) => {
    dispatch(updateEditorReminderRepetitions(e.target.value, reminder.key));
  };

  const onIntervalInputChange = (e) => {
    dispatch(updateEditorReminderInterval(e.target.value, reminder.key));
  };

  const onMessageBtnClick = () => {
    dispatch(updateEditorSelectingReminderKey(reminder.key + '/' + MESSAGE_KEY));
    updatePopupUrlHash(
      EDITOR_DEFAULT_MENU_POPUP, true, messageBtn.current.getBoundingClientRect()
    );
  };

  const onCustomMessageInputChange = (e) => {
    dispatch(updateEditorReminderCustomMessage(e.target.value, reminder.key));
  };

  const onMessageDisplayDurationBtnClick = () => {
    dispatch(
      updateEditorSelectingReminderKey(reminder.key + '/' + MESSAGE_DISPLAY_DURATION_KEY)
    );
    updatePopupUrlHash(
      EDITOR_DEFAULT_MENU_POPUP,
      true,
      messageDisplayDurationBtn.current.getBoundingClientRect()
    );
  };

  const onCustomMessageDisplayDurationInputChange = (e) => {
    dispatch(
      updateEditorReminderCustomMessageDisplayDuration(e.target.value, reminder.key)
    );
  };

  const onSoundBtnClick = () => {
    dispatch(updateEditorSelectingReminderKey(reminder.key));
    updatePopupUrlHash(
      EDITOR_REMINDER_SOUND_MENU_POPUP,
      true,
      soundBtn.current.getBoundingClientRect()
    );
  };

  const onPlayBtnClick = () => {
    const sound = SOUNDS.find(sound => sound.name === reminder.sound);
    if (sound) {
      const audio = new Audio(sound.path);
      audio.addEventListener("canplaythrough", () => {
        audio.play();
      });
    }
  };

  const onMenuBtnClick = () => {
    dispatch(updateEditorSelectingReminderKey(reminder.key));
    updatePopupUrlHash(
      EDITOR_REMINDER_MENU_POPUP, true, menuBtn.current.getBoundingClientRect()
    );
  };

  let rowClassNames = '', colClassNames = '', moreOptions = null;
  if (reminder.isMoreOptionsShown) {
    colClassNames = 'pt-4 pb-2.5';

    const customMessageClassNames = reminder.message === DEFAULT ? 'text-gray-500 border-gray-200' : 'text-gray-900 border-gray-300';
    const customMessageDisplayDurationClassNames = reminder.messageDisplayDuration === DEFAULT ? 'text-gray-500 border-gray-200' : reminder.messageDisplayDurationErrMsg ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500';
    moreOptions = (
      <React.Fragment>
        <motion.tr layoutId={`${reminder.key}-2`} className="h-14">
          <td></td>
          <td colSpan={2} className="px-6 py-2.5">
            <label htmlFor={`reminder-message-${reminder.key}`} className="block text-sm font-medium text-gray-700">Reminder message</label>
            <div className="mt-1 flex">
              <button ref={messageBtn} onClick={onMessageBtnClick} name={`reminder-message-${reminder.key}`} id={`reminder-message-${reminder.key}`} type="button" className="group inline-flex justify-between w-24 rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white sm:text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500" aria-expanded="true" aria-haspopup="true">
                {reminder.message}
                <svg className="-mr-1 ml-2 h-5 w-5 text-gray-500 group-hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <input onChange={onCustomMessageInputChange} type="text" name={`reminder-custom-message-${reminder.key}`} id={`reminder-custom-message-${reminder.key}`} className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-1 ml-4 ${customMessageClassNames}`} value={reminder.customMessage} disabled={reminder.message === DEFAULT} />
            </div>
          </td>
          <td></td>
        </motion.tr>
        <motion.tr layoutId={`${reminder.key}-3`} className="h-14">
          <td></td>
          <td colSpan={2} className="px-6 py-2.5">
            <label htmlFor={`reminder-message-display-duration-${reminder.key}`} className="block text-sm font-medium text-gray-700">Reminder display duration (seconds)</label>
            <div className="mt-1 flex items-start">
              <button ref={messageDisplayDurationBtn} onClick={onMessageDisplayDurationBtnClick} name={`reminder-message-display-duration-${reminder.key}`} id={`reminder-message-display-duration-${reminder.key}`} type="button" className="group inline-flex justify-between w-24 rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white sm:text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500" aria-expanded="true" aria-haspopup="true">
                {reminder.messageDisplayDuration}
                <svg className="-mr-1 ml-2 h-5 w-5 text-gray-500 group-hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="ml-4 w-full">
                <input onChange={onCustomMessageDisplayDurationInputChange} type="text" name={`reminder-custom-message-display-duration-${reminder.key}`} id={`reminder-custom-message-display-duration-${reminder.key}`} className={`shadow-sm block w-full sm:text-sm rounded-md py-1 ${customMessageDisplayDurationClassNames}`} value={reminder.customMessageDisplayDuration} disabled={reminder.messageDisplayDuration === DEFAULT} />
                {reminder.messageDisplayDurationErrMsg && <p className="mt-1.5 text-sm text-red-600">{reminder.messageDisplayDurationErrMsg}</p>}
              </div>
            </div>
          </td>
          <td></td>
        </motion.tr>
        <motion.tr layoutId={`${reminder.key}-4`} className="border-b border-gray-200">
          <td></td>
          <td colSpan={2} className="px-6 pt-2.5 pb-4">
            <label htmlFor={`reminder-sound-${reminder.key}`} className="block text-sm font-medium text-gray-700">Reminder sound</label>
            <div className="mt-1 flex">
              <button ref={soundBtn} onClick={onSoundBtnClick} name={`reminder-sound-${reminder.key}`} id={`reminder-sound-${reminder.key}`} type="button" className="group inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white sm:text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500" aria-expanded="true" aria-haspopup="true">
                {reminder.sound}
                <svg className="-mr-1 ml-2 h-5 w-5 text-gray-500 group-hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={onPlayBtnClick} className="ml-2 pl-1 rounded group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="button">
                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.2596 3.6912C11.4788 3.78209 11.6661 3.93594 11.7979 4.13331C11.9297 4.33067 12 4.56268 12 4.8V19.2C11.9999 19.4373 11.9295 19.6693 11.7976 19.8665C11.6658 20.0638 11.4784 20.2176 11.2591 20.3084C11.0399 20.3992 10.7987 20.423 10.5659 20.3767C10.3332 20.3304 10.1194 20.2162 9.95155 20.0484L5.50315 15.6H2.39995C2.08169 15.6 1.77647 15.4736 1.55142 15.2485C1.32638 15.0235 1.19995 14.7183 1.19995 14.4V9.6C1.19995 9.28174 1.32638 8.97651 1.55142 8.75147C1.77647 8.52642 2.08169 8.4 2.39995 8.4H5.50315L9.95155 3.9516C10.1194 3.78368 10.3332 3.66931 10.566 3.62295C10.7989 3.5766 11.0402 3.60035 11.2596 3.6912ZM17.5884 3.5148C17.8134 3.28983 18.1186 3.16345 18.4368 3.16345C18.7549 3.16345 19.0601 3.28983 19.2852 3.5148C20.4009 4.62798 21.2858 5.95062 21.889 7.40677C22.4922 8.86291 22.8018 10.4239 22.8 12C22.8018 13.5761 22.4922 15.1371 21.889 16.5932C21.2858 18.0494 20.4009 19.372 19.2852 20.4852C19.0588 20.7038 18.7557 20.8247 18.4411 20.822C18.1264 20.8193 17.8255 20.6931 17.603 20.4706C17.3805 20.2481 17.2543 19.9471 17.2515 19.6325C17.2488 19.3178 17.3698 19.0147 17.5884 18.7884C18.4813 17.8981 19.1894 16.84 19.672 15.6749C20.1545 14.5099 20.4019 13.261 20.4 12C20.4 9.348 19.3272 6.9504 17.5884 5.2116C17.3634 4.98656 17.237 4.68139 17.237 4.3632C17.237 4.045 17.3634 3.73983 17.5884 3.5148ZM14.1936 6.9084C14.305 6.79682 14.4373 6.70831 14.583 6.64792C14.7287 6.58754 14.8849 6.55645 15.0426 6.55645C15.2002 6.55645 15.3564 6.58754 15.5021 6.64792C15.6478 6.70831 15.7801 6.79682 15.8916 6.9084C16.561 7.57639 17.0919 8.37007 17.4537 9.24385C17.8155 10.1176 18.0012 11.0543 18 12C18.0011 12.9457 17.8155 13.8823 17.4536 14.7561C17.0918 15.6299 16.561 16.4236 15.8916 17.0916C15.6664 17.3168 15.361 17.4433 15.0426 17.4433C14.7241 17.4433 14.4187 17.3168 14.1936 17.0916C13.9684 16.8664 13.8419 16.561 13.8419 16.2426C13.8419 15.9242 13.9684 15.6188 14.1936 15.3936C14.6402 14.9486 14.9943 14.4197 15.2357 13.8373C15.4771 13.2549 15.6009 12.6304 15.6 12C15.6009 11.3695 15.4772 10.7451 15.2358 10.1627C14.9944 9.58026 14.6402 9.05134 14.1936 8.6064C14.082 8.49495 13.9935 8.3626 13.9331 8.21692C13.8727 8.07125 13.8416 7.91509 13.8416 7.7574C13.8416 7.5997 13.8727 7.44355 13.9331 7.29787C13.9935 7.15219 14.082 7.01984 14.1936 6.9084Z" />
                </svg>
              </button>
            </div>
          </td>
          <td></td>
        </motion.tr>
      </React.Fragment>
    );
  } else {
    rowClassNames = 'border-b border-gray-200';
    colClassNames = 'py-2.5';
  }

  let errorRow;
  if (reminder.repetitionsErrMsg || reminder.intervalErrMsg) {
    let errRowClassNames = '', errColClassNames = '';
    if (reminder.isMoreOptionsShown) {
      rowClassNames = '';
      colClassNames = 'pt-4 pb-0.5';
      errColClassNames = 'pt-1 pb-2.5';
    } else {
      rowClassNames = '';
      colClassNames = 'pt-2.5 pb-0.5';
      errRowClassNames = 'border-b border-gray-200';
      errColClassNames = 'pt-1 pb-2.5';
    }

    errorRow = (
      <motion.tr layoutId={`${reminder.key}-err`} className={errRowClassNames}>
        <td></td>
        <td className={`px-6 text-sm text-red-600 ${errColClassNames}`}>
          {reminder.repetitionsErrMsg}
        </td>
        <td className={`px-6 text-sm text-red-600 ${errColClassNames}`}>
          {reminder.intervalErrMsg}
        </td>
        <td></td>
      </motion.tr>
    );
  }

  const repetitionsInputClassNames = reminder.repetitionsErrMsg ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500';

  const intervalInputClassNames = reminder.intervalErrMsg ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <React.Fragment>
      <motion.tr layoutId={`${reminder.key}-1`} className={rowClassNames}>
        <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-500 truncate ${colClassNames}`}>{seq + 1}</td>
        <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-500 truncate ${colClassNames}`}>
          <input onChange={onRepetitionsInputChange} type="text" name={`reminder-repetitions-${reminder.key}`} id={`reminder-repetitions-${reminder.key}`} className={`shadow-sm block w-full sm:text-sm rounded-md py-1 ${repetitionsInputClassNames}`} value={reminder.repetitions} />
        </td>
        <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-500 truncate ${colClassNames}`}>
          <input onChange={onIntervalInputChange} type="text" name={`reminder-interval-${reminder.key}`} id={`reminder-interval-${reminder.key}`} className={`shadow-sm block w-full sm:text-sm rounded-md py-1 ${intervalInputClassNames}`} value={seq === 0 ? 'On time up' : reminder.interval} disabled={seq === 0} />
        </td>
        <td className="text-right">
          <div className="w-full h-full flex items-center justify-end">
            <button ref={menuBtn} onClick={onMenuBtnClick} type="button" className="bg-white pl-3 pr-4 group focus:outline-none">
              <div className="w-5 h-9 rounded-full flex items-center group-hover:bg-gray-50 group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-indigo-500">
                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6C9.46957 6 8.96086 5.78929 8.58579 5.41421C8.21071 5.03914 8 4.53043 8 4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2C10.5304 2 11.0391 2.21071 11.4142 2.58579C11.7893 2.96086 12 3.46957 12 4C12 4.53043 11.7893 5.03914 11.4142 5.41421C11.0391 5.78929 10.5304 6 10 6ZM10 12C9.46957 12 8.96086 11.7893 8.58579 11.4142C8.21071 11.0391 8 10.5304 8 10C8 9.46957 8.21071 8.96086 8.58579 8.58579C8.96086 8.21071 9.46957 8 10 8C10.5304 8 11.0391 8.21071 11.4142 8.58579C11.7893 8.96086 12 9.46957 12 10C12 10.5304 11.7893 11.0391 11.4142 11.4142C11.0391 11.7893 10.5304 12 10 12ZM10 18C9.46957 18 8.96086 17.7893 8.58579 17.4142C8.21071 17.0391 8 16.5304 8 16C8 15.4696 8.21071 14.9609 8.58579 14.5858C8.96086 14.2107 9.46957 14 10 14C10.5304 14 11.0391 14.2107 11.4142 14.5858C11.7893 14.9609 12 15.4696 12 16C12 16.5304 11.7893 17.0391 11.4142 17.4142C11.0391 17.7893 10.5304 18 10 18Z" />
                </svg>
              </div>
            </button>
          </div>
        </td>
      </motion.tr>
      {errorRow}
      {moreOptions}
    </React.Fragment>
  );
};

export default React.memo(EditorReminderItem);
