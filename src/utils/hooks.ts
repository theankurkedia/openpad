import { EditorState } from 'draft-js';
import { useEffect } from 'react';
import { getEncodedContent } from './Editor';

export function useAutoSave(editorState: EditorState, save: () => void) {
  useEffect(() => {
    let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
    let autoSaveTimerShutCounter = 5;

    const beforeUnloadHandler = (e: any) => {
      if (
        editorState.getCurrentContent().getPlainText() &&
        `?data=${getEncodedContent(editorState.getCurrentContent())}` !==
          window.location.search
      ) {
        // DOC: prevent the browser from closing the window in case there are unsaved changes
        save();
        e.preventDefault();
        e.returnValue = '';
        return 'Unsaved Changes';
      }
      return;
    };

    const initializeAutoSave = () => {
      autoSaveTimer = setInterval(() => {
        if (
          (window.location.search &&
            !editorState.getCurrentContent().getPlainText()) ||
          (editorState.getCurrentContent().getPlainText() &&
            `?data=${getEncodedContent(editorState.getCurrentContent())}` !==
              window.location.search)
        ) {
          save();
        } else {
          autoSaveTimerShutCounter--;
        }
        //  DOC: shutdown the autosave after 5 unchanged save attempts
        if (!autoSaveTimerShutCounter && autoSaveTimer) {
          clearInterval(autoSaveTimer);
        }
        // Checking every 2 mins
      }, 2 * 60 * 1000);
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    initializeAutoSave();

    return () => {
      if (autoSaveTimer) clearInterval(autoSaveTimer);
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [editorState, save]);
}
