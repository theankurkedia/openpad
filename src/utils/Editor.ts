import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js';

export function moveFocusToEnd(editorState: EditorState) {
  editorState = EditorState.moveFocusToEnd(editorState);
  return EditorState.forceSelection(editorState, editorState.getSelection());
}

export const getEncodedContent = (content: ContentState) => {
  return encodeURIComponent(JSON.stringify(convertToRaw(content)));
};
export const getDecodedContent = (raw: string): ContentState => {
  return convertFromRaw(JSON.parse(decodeURIComponent(raw)));
};
