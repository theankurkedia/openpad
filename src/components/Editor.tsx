import React from 'react';
import { Editor as DraftEditor, EditorState } from 'draft-js';
import { moveFocusToEnd } from '../utils';
import 'draft-js/dist/Draft.css';

export function Editor({
  editorState,
  setEditorState,
  initHydrated,
}: {
  editorState: EditorState;
  setEditorState: (val: any) => void;
  initHydrated: boolean;
}) {
  const editorRef: any = React.createRef();
  React.useEffect(() => {
    if (editorState.getCurrentContent().getPlainText()) {
      setEditorState(moveFocusToEnd(editorState));
    } else if (editorRef && editorRef.current) {
      editorRef.current.focus();
    }
  }, [initHydrated]);
  return (
    <DraftEditor
      ref={editorRef}
      editorState={editorState}
      onChange={(val: any) => {
        setEditorState(val);
      }}
    />
  );
}
