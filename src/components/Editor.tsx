import {
  DraftHandleValue,
  Editor as DraftEditor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import React from 'react';
import { moveFocusToEnd } from '../utils';

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

  const onChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  // All shortcuts here [https://tinyurl.com/yhkgzyem]
  const keyBindingFn = (e: any) => {
    if (
      e.keyCode === 83 /* `S` key */ &&
      hasCommandModifier(e) /* + `Ctrl` key */
    ) {
      return 'ctrl_s_command';
    } else if (
      e.keyCode === 67 /* `C` key */ &&
      hasCommandModifier(e) /* + `Ctrl` key */ &&
      // isCollapsed to check if no text is selected
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

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    switch (command) {
      // TODO: handle undo/redo
      case 'ctrl_s_command':
        save();
        return 'handled';
      case 'ctrl_c_command':
        copy();
        return 'handled';
      case 'ctrl_x_command':
        clear();
        return 'handled';
      default:
        // Check if the command needs to be handled by rich text utilities
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          onChange(newState);
          return 'handled';
        }
        return 'not-handled';
    }
  };

  return (
    <DraftEditor
      ariaLabel='editor'
      ref={editorRef}
      editorState={editorState}
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={keyBindingFn}
      onChange={onChange}
    />
  );
}

export default React.memo(Editor);
