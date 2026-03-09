import { useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_HIGH,
  LexicalEditor,
} from 'lexical';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { EDITOR_TRANSFORMERS } from '../utils/Editor';
import { EditorMode } from '../types';

const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
  },
  list: {
    ul: 'editor-list-ul',
    ol: 'editor-list-ol',
    listitem: 'editor-list-item',
    checklist: 'editor-checklist',
    listitemChecked: 'editor-list-item-checked',
    listitemUnchecked: 'editor-list-item-unchecked',
  },
  link: 'editor-link',
  quote: 'editor-quote',
};

type KeyboardPluginProps = {
  save: () => void;
  copy: () => void;
  clear: () => void;
};

function KeyboardShortcutsPlugin({ save, copy, clear }: KeyboardPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        if (!event.metaKey && !event.ctrlKey) return false;

        switch (event.key) {
          case 's': {
            event.preventDefault();
            save();
            return true;
          }
          case 'j': {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            return true;
          }
          case 'c': {
            const selection = $getSelection();
            if ($isRangeSelection(selection) && selection.isCollapsed()) {
              event.preventDefault();
              copy();
              return true;
            }
            return false;
          }
          case 'x': {
            const selection = $getSelection();
            if ($isRangeSelection(selection) && selection.isCollapsed()) {
              event.preventDefault();
              clear();
              return true;
            }
            return false;
          }
          default:
            return false;
        }
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, save, copy, clear]);

  return null;
}

function EditorRefPlugin({
  onEditorReady,
}: {
  onEditorReady: (editor: LexicalEditor) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);

  return null;
}

type EditorProps = {
  mode: EditorMode;
  initialMarkdown: string;
  onEditorReady: (editor: LexicalEditor) => void;
  save: () => void;
  copy: () => void;
  clear: () => void;
};

function Editor({
  mode,
  initialMarkdown,
  onEditorReady,
  save,
  copy,
  clear,
}: EditorProps) {
  const editorStateInit = useCallback(() => {
    if (initialMarkdown) {
      $convertFromMarkdownString(initialMarkdown, EDITOR_TRANSFORMERS);
    } else if (mode === 'checkbox') {
      const root = $getRoot();
      root.clear();
      const list = new ListNode('check', 1);
      const item = new ListItemNode();
      item.setChecked(false);
      list.append(item);
      root.append(list);
    }
  }, [initialMarkdown, mode]);

  const initialConfig = {
    namespace: 'OpenPad',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode],
    editorState: initialMarkdown || mode === 'checkbox' ? editorStateInit : undefined,
  };

  return (
    <LexicalComposer key={mode} initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="editor-content" aria-label="editor" />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      {mode === 'checkbox' && <CheckListPlugin />}
      <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
      <KeyboardShortcutsPlugin save={save} copy={copy} clear={clear} />
      <EditorRefPlugin onEditorReady={onEditorReady} />
    </LexicalComposer>
  );
}

export default Editor;
