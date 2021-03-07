import React from 'react';
import Editor from './Editor';
import { EditorState, ContentState } from 'draft-js';
import './App.css';
function App() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  React.useEffect(() => {
    let parseData;

    let urlData = window?.location?.search?.split('?data=');
    parseData = urlData ? decodeURIComponent(urlData[1]) : undefined;
    if (!parseData) {
      parseData = localStorage.getItem('openpad');
    }
    if (parseData) {
      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(parseData))
      );
    }
  }, []);

  return (
    <div className='App'>
      <h2>OpenPad</h2>
      <div style={{ width: '100%' }}>
        <div
          style={{
            justifyContent: 'flex-end',
            display: 'flex',
            marginRight: 36,
            paddingBottom: 20,
          }}
        >
          <button
            className='button'
            onClick={() => {
              localStorage.setItem(
                'openpad',
                editorState.getCurrentContent().getPlainText()
              );
            }}
          >
            Store data
          </button>
          <button
            className='button'
            onClick={() => {
              setEditorState(EditorState.createEmpty());
              localStorage.removeItem('openpad');
            }}
          >
            Clear data
          </button>
          <button
            className='button'
            onClick={() => {
              let daraUrl = `${
                window.location.origin
              }?data=${encodeURIComponent(
                editorState.getCurrentContent().getPlainText()
              )}`;
              console.log();
              navigator.clipboard.writeText(daraUrl).then(
                function () {
                  console.log('Url copied successfully');
                },
                function () {
                  console.log('Error in copying url');
                }
              );
            }}
          >
            Share
          </button>
        </div>
        <div className='editor'>
          <Editor editorState={editorState} setEditorState={setEditorState} />
        </div>
      </div>
    </div>
  );
}

export default App;
