import { EditorState } from 'draft-js';
import React from 'react';
import {
  getDecodedContent,
  getEncodedContent,
  shortenAndCopyUrl,
} from '../utils';
import ActionButtonGroup from './ActionButtonGroup';
import Editor from './Editor';

function ActionArea() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [initHydrated, setInitHydrated] = React.useState(false);

  /**
   * Check if the data is stored in the url. If so, hydrate the editor.
   * The data stars with `data=` query string
   */
  React.useEffect(() => {
    let urlData = window?.location?.search?.split('?data=');
    let parseData =
      urlData && urlData.length > 1 ? getDecodedContent(urlData[1]) : undefined;
    if (parseData) {
      setEditorState(EditorState.createWithContent(parseData));
    }
    setInitHydrated(true);
  }, []);

  const clear = () => {
    setEditorState(EditorState.createEmpty());
    let dataUrl = window.location.origin;
    window.history.pushState('data', 'OpenPad', dataUrl);
  };

  const save = (dataUrl?: string) => {
    dataUrl =
      dataUrl ??
      `${window.location.origin}${
        editorState.getCurrentContent().getPlainText()
          ? `/?data=${getEncodedContent(editorState.getCurrentContent())}`
          : ''
      }`;
    if (window.location.href !== dataUrl) {
      window.history.pushState('data', 'OpenPad', dataUrl);
    }
  };

  const copyLink = () => {
    return new Promise((resolve, reject) => {
      if (editorState.getCurrentContent().getPlainText()) {
        let dataUrl = `${window.location.origin}?data=${getEncodedContent(
          editorState.getCurrentContent()
        )}`;
        save(dataUrl);
        // Generating link only if requested, otherwise just save the data in url
        shortenAndCopyUrl(dataUrl, navigator, resolve, reject);
      } else {
        resolve(false);
      }
    });
  };

  const copyStates = ['Copy link', 'Copying...', 'Link copied'];
  // 0 -> nothing, 1 -> copying, 2 -> copied
  const [copyState, setCopyState] = React.useState(0);
  const copy = () => {
    setCopyState(1);
    copyLink().then(
      (response: any) => {
        if (response) {
          setCopyState(2);
          setTimeout(() => {
            setCopyState(0);
          }, 5000);
        } else {
          setCopyState(0);
        }
      },
      (error: Error) => {
        console.log('error', error);
        setCopyState(0);
      }
    );
  };
  return (
    <div style={{ width: '100%' }}>
      <ActionButtonGroup
        clear={clear}
        copy={copy}
        save={save}
        copyState={copyStates[copyState]}
      />
      <div className='editor'>
        <Editor
          editorState={editorState}
          setEditorState={setEditorState}
          initHydrated={initHydrated}
          clear={clear}
          copy={copy}
          save={save}
        />
      </div>
    </div>
  );
}

export default React.memo(ActionArea);
