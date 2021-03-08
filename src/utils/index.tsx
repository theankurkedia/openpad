import { EditorState } from 'draft-js';

export function moveFocusToEnd(editorState: EditorState) {
  editorState = EditorState.moveFocusToEnd(editorState);
  return EditorState.forceSelection(editorState, editorState.getSelection());
}
