import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TRANSFORMERS,
  CHECK_LIST,
} from '@lexical/markdown';
import { LexicalEditor, $getRoot } from 'lexical';

export const EDITOR_TRANSFORMERS = [...TRANSFORMERS, CHECK_LIST];

export function getEncodedContent(editor: LexicalEditor): string {
  let markdown = '';
  editor.getEditorState().read(() => {
    markdown = $convertToMarkdownString(EDITOR_TRANSFORMERS);
  });
  return encodeURIComponent(markdown);
}

export function getDecodedContent(raw: string): string {
  return decodeURIComponent(raw);
}

export function getPlainText(editor: LexicalEditor): string {
  let text = '';
  editor.getEditorState().read(() => {
    text = $getRoot().getTextContent();
  });
  return text;
}
