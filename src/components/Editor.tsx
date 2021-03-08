import React from 'react';
import { Editor as DraftEditor } from 'draft-js';
import 'draft-js/dist/Draft.css';

export function Editor({
  editorState,
  setEditorState,
}: {
  editorState: any;
  setEditorState: (val: any) => void;
}) {
  const editorRef: any = React.createRef();
  React.useEffect(() => {
    if (editorRef && editorRef.current) {
      editorRef.current.focus();
    }
  });
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
