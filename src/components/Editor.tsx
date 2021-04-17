import React from 'react';
import {
  Editor as DraftEditor,
  EditorState,
  DraftHandleValue,
  getDefaultKeyBinding,
  KeyBindingUtil,
} from 'draft-js';
import { moveFocusToEnd } from '../utils';
import 'draft-js/dist/Draft.css';

const { hasCommandModifier } = KeyBindingUtil;

type EditorProps = {
  editorState: EditorState;
  setEditorState: (val: any) => void;
  initHydrated: boolean;
  save: () => void;
  copy: () => void;
  clear: () => void;
};

function Editor({
  editorState,
  setEditorState,
  initHydrated,
  save,
  copy,
  clear,
}: EditorProps) {
  const editorRef: any = React.createRef();
  React.useEffect(() => {
    if (editorState.getCurrentContent().getPlainText()) {
      setEditorState(moveFocusToEnd(editorState));
    } else if (editorRef && editorRef.current) {
      editorRef.current.focus();
    }
  }, [initHydrated]);

  const myKeyBindingFn = (e: any) => {
    if (
      e.keyCode === 83 /* `S` key */ &&
      hasCommandModifier(e) /* + `Ctrl` key */
    ) {
      return 'ctrl_s_command';
    } else if (
      e.keyCode === 67 /* `C` key */ &&
      hasCommandModifier(e) /* + `Ctrl` key */ &&
      editorState.getSelection().isCollapsed()
    ) {
      return 'ctrl_c_command';
    } else if (
      e.keyCode === 88 /* `X` key */ &&
      hasCommandModifier(e) /* + `Ctrl` key */ &&
      editorState.getSelection().isCollapsed()
    ) {
      return 'ctrl_x_command';
    }
    return getDefaultKeyBinding(e);
  };
  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === 'ctrl_s_command') {
      save();
      return 'handled';
    } else if (command === 'ctrl_c_command') {
      copy();
      return 'handled';
    } else if (command === 'ctrl_x_command') {
      clear();
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <DraftEditor
      ref={editorRef}
      editorState={editorState}
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={myKeyBindingFn}
      onChange={(val: any) => {
        setEditorState(val);
      }}
    />
  );
}

export default React.memo(Editor);
