import React from 'react';
import { EditorMode } from '../types';

type ActionButtonGroupProps = {
  clear: () => void;
  save: () => void;
  copy: () => void;
  copyState: string;
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
};

function ActionButtonGroup({
  clear,
  save,
  copy,
  copyState,
  mode,
  setMode,
}: ActionButtonGroupProps) {
  return (
    <div className="action-bar">
      <div className="mode-switcher">
        <button
          className={`mode-button ${mode === 'plain' ? 'mode-active' : ''}`}
          onClick={() => setMode('plain')}
          aria-label="plain text mode"
        >
          Text
        </button>
        <button
          className={`mode-button ${mode === 'checkbox' ? 'mode-active' : ''}`}
          onClick={() => setMode('checkbox')}
          aria-label="checkbox mode"
        >
          Checklist
        </button>
      </div>
      <div className="button-group">
        <button className="button" onClick={() => save()} aria-label="save">
          Save
        </button>
        <button
          className="button"
          onClick={copy}
          disabled={copyState.includes('Copying')}
          aria-label="copy"
        >
          {copyState}
        </button>
        <button className="button" onClick={clear} aria-label="clear">
          Clear
        </button>
      </div>
    </div>
  );
}

export default React.memo(ActionButtonGroup);
