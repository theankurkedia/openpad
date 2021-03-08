import React from 'react';
import { Editor, ActionButtonGroup } from './components';
import { EditorState, ContentState } from 'draft-js';
import './App.css';

function App() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  React.useEffect(() => {
    let parseData;
    let urlData = window?.location?.search?.split('?data=');
    parseData =
      urlData && urlData.length > 1
        ? decodeURIComponent(urlData[1])
        : undefined;
    if (parseData) {
      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(parseData))
      );
    }
  }, []);

  const clearState = () => {
    setEditorState(EditorState.createEmpty());
    let dataUrl = window.location.origin;
    window.history.pushState('data', 'OpenPad', dataUrl);
  };
  const saveState = (dataUrl?: any) => {
    dataUrl =
      dataUrl ??
      `${window.location.origin}?data=${encodeURIComponent(
        editorState.getCurrentContent().getPlainText()
      )}`;
    if (dataUrl) {
      window.history.pushState('data', 'OpenPad', dataUrl);
    }
  };
  const copyLink = () => {
    return new Promise((resolve, reject) => {
      const encodedData = encodeURIComponent(
        editorState.getCurrentContent().getPlainText()
      );
      if (encodedData) {
        let dataUrl = `${window.location.origin}?data=${encodedData}`;
        saveState(dataUrl);
        navigator.clipboard.writeText(dataUrl).then(
          () => {
            console.log('Url copied successfully');
            resolve(dataUrl);
          },
          (error: any) => {
            console.log('Error in copying url');
            reject(error);
          }
        );
      } else {
        resolve(false);
      }
    });
  };
  return (
    <div className='App'>
      <h2>OpenPad</h2>
      <div style={{ width: '100%' }}>
        <ActionButtonGroup
          clearState={clearState}
          copyLink={copyLink}
          saveState={() => saveState()}
        />
        <div className='editor'>
          <Editor editorState={editorState} setEditorState={setEditorState} />
        </div>
      </div>
    </div>
  );
}

export default App;
