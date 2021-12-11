import { EditorState } from 'draft-js';
import React from 'react';
import Editor from './Editor';
import ActionButtonGroup from './ActionButtonGroup';
import {
  shortenAndCopyUrl,
  getEncodedContent,
  getDecodedContent,
} from './../utils';

function ActionArea() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [initHydrated, setInitHydrated] = React.useState(false);

  React.useEffect(() => {
    let parseData;
    let urlData = window?.location?.search?.split('?data=');
    parseData =
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

  const save = (dataUrl?: any) => {
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
        shortenAndCopyUrl(dataUrl, navigator, resolve, reject);
      } else {
        resolve(false);
      }
    });
  };

  const copyStates = ['Copy link', 'Copying...', 'Link copied'];
  const [copyState, setCopyState] = React.useState(0);
  // 0 -> nothing, 1 -> copying, 2 -> copied
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
      (error: any) => {
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
        copyState={copyState}
        copyStates={copyStates}
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
