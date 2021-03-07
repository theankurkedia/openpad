import React from 'react';
import { Editor as DraftEditor } from 'draft-js';
import 'draft-js/dist/Draft.css';

export default function Editor({
  editorState,
  setEditorState,
}: {
  editorState: any;
  setEditorState: (val: any) => void;
}) {
  return (
    <DraftEditor
      editorState={editorState}
      onChange={(val: any) => {
        setEditorState(val);
      }}
    />
  );
}
