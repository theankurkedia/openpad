import { useEffect, useCallback, useState } from 'react';
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
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_HIGH,
  LexicalEditor,
  TextFormatType,
} from 'lexical';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { EDITOR_TRANSFORMERS } from '../utils/Editor';
import { EditorMode } from '../types';
import DragDropChecklistPlugin from './DragDropChecklistPlugin';

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

// ── Toolbar Plugin ──

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(new Set());
  const [blockType, setBlockType] = useState('paragraph');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const formats = new Set<TextFormatType>();
        if (selection.hasFormat('bold')) formats.add('bold');
        if (selection.hasFormat('italic')) formats.add('italic');
        if (selection.hasFormat('strikethrough')) formats.add('strikethrough');
        if (selection.hasFormat('code')) formats.add('code');
        setActiveFormats(formats);

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
        const type = element.getType();

        if (type === 'heading') {
          setBlockType((element as any).getTag());
        } else if (type === 'list') {
          const listType = (element as any).getListType?.();
          setBlockType(listType === 'number' ? 'ol' : 'ul');
        } else if (type === 'quote') {
          setBlockType('quote');
        } else {
          setBlockType('paragraph');
        }
      });
    });
  }, [editor]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (type === 'paragraph') {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (type === 'h1' || type === 'h2' || type === 'h3') {
        if (blockType === type) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(type));
        }
      } else if (type === 'quote') {
        if (blockType === 'quote') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });

    if (type === 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (type === 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${activeFormats.has('bold') ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatText('bold')}
          title="Bold (⌘B)"
          aria-label="bold"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </button>
        <button
          className={`toolbar-btn ${activeFormats.has('italic') ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatText('italic')}
          title="Italic (⌘I)"
          aria-label="italic"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </button>
        <button
          className={`toolbar-btn ${activeFormats.has('strikethrough') ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatText('strikethrough')}
          title="Strikethrough"
          aria-label="strikethrough"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4" />
            <path d="M14 12a4 4 0 0 1 0 8H6" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </button>
        <button
          className={`toolbar-btn ${activeFormats.has('code') ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatText('code')}
          title="Code (⌘J)"
          aria-label="code"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${blockType === 'h1' ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatBlock('h1')}
          title="Heading 1"
          aria-label="heading 1"
        >
          <span className="toolbar-text">H1</span>
        </button>
        <button
          className={`toolbar-btn ${blockType === 'h2' ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatBlock('h2')}
          title="Heading 2"
          aria-label="heading 2"
        >
          <span className="toolbar-text">H2</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${blockType === 'ul' ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatBlock('ul')}
          title="Bullet list"
          aria-label="bullet list"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
        <button
          className={`toolbar-btn ${blockType === 'ol' ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatBlock('ol')}
          title="Numbered list"
          aria-label="numbered list"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>
        <button
          className={`toolbar-btn ${blockType === 'quote' ? 'toolbar-btn-active' : ''}`}
          onClick={() => formatBlock('quote')}
          title="Quote"
          aria-label="quote"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M10 8c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2l-2 4h2.5l2-4V8H10zm-6 0c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2l-2 4h2.5l2-4V8H4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Keyboard Shortcuts Plugin ──

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

// ── Editor Ref Plugin ──

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

// ── Main Editor ──

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
      {mode === 'plain' && <ToolbarPlugin />}
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
      {mode === 'checkbox' && <DragDropChecklistPlugin />}
      <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
      <KeyboardShortcutsPlugin save={save} copy={copy} clear={clear} />
      <EditorRefPlugin onEditorReady={onEditorReady} />
    </LexicalComposer>
  );
}

export default Editor;
