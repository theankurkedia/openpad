import React from 'react';
import { LexicalEditor, $getRoot } from 'lexical';
import {
  getDecodedContent,
  getEncodedContent,
  getPlainText,
  shortenAndCopyUrl,
  useAutoSave,
} from '../utils';
import { EditorMode } from '../types';
import ActionButtonGroup from './ActionButtonGroup';
import Editor from './Editor';

function ActionArea() {
  const editorRef = React.useRef<LexicalEditor | null>(null);
  const [mode, setMode] = React.useState<EditorMode>('plain');
  const [initialMarkdown, setInitialMarkdown] = React.useState('');
  const [initHydrated, setInitHydrated] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    const urlMode = params.get('mode') as EditorMode | null;

    if (urlMode === 'checkbox') setMode('checkbox');
    if (data) setInitialMarkdown(getDecodedContent(data));

    setInitHydrated(true);
  }, []);

  const onEditorReady = React.useCallback((editor: LexicalEditor) => {
    editorRef.current = editor;
  }, []);

  const save = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const text = getPlainText(editor);
    const encoded = getEncodedContent(editor);
    const dataUrl = text
      ? `${window.location.origin}/?data=${encoded}&mode=${mode}`
      : window.location.origin;

    if (window.location.href !== dataUrl) {
      window.history.pushState('data', 'OpenPad', dataUrl);
    }
  }, [mode]);

  useAutoSave(editorRef.current, save);

  const clear = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.update(() => {
      $getRoot().clear();
    });
    window.history.pushState('data', 'OpenPad', window.location.origin);
  }, []);

  const copyStates = ['Copy link', 'Copying...', 'Link copied'];
  const [copyState, setCopyState] = React.useState(0);

  const copyLink = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return Promise.resolve(false);

    const text = getPlainText(editor);
    if (!text) return Promise.resolve(false);

    const encoded = getEncodedContent(editor);
    const dataUrl = `${window.location.origin}/?data=${encoded}&mode=${mode}`;
    save();

    return new Promise((resolve, reject) => {
      shortenAndCopyUrl(dataUrl, navigator, resolve, reject);
    });
  }, [mode, save]);

  const copy = React.useCallback(() => {
    setCopyState(1);
    copyLink().then(
      (response: any) => {
        if (response) {
          setCopyState(2);
          setTimeout(() => setCopyState(0), 5000);
        } else {
          setCopyState(0);
        }
      },
      (error: Error) => {
        console.log('error', error);
        setCopyState(0);
      }
    );
  }, [copyLink]);

  const handleModeChange = React.useCallback(
    (newMode: EditorMode) => {
      const editor = editorRef.current;
      if (editor) {
        const text = getPlainText(editor);
        if (text) {
          const encoded = getEncodedContent(editor);
          setInitialMarkdown(getDecodedContent(encoded));
        } else {
          setInitialMarkdown('');
        }
      }
      setMode(newMode);
    },
    []
  );

  if (!initHydrated) return null;

  return (
    <div style={{ width: '100%' }}>
      <ActionButtonGroup
        clear={clear}
        copy={copy}
        save={save}
        copyState={copyStates[copyState]}
        mode={mode}
        setMode={handleModeChange}
      />
      <div className="editor">
        <Editor
          key={mode}
          mode={mode}
          initialMarkdown={initialMarkdown}
          onEditorReady={onEditorReady}
          save={save}
          copy={copy}
          clear={clear}
        />
      </div>
    </div>
  );
}

export default React.memo(ActionArea);
