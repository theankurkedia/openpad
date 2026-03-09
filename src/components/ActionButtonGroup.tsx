import React from 'react';
import { EditorMode } from '../types';

const TextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3" />
    <path d="M9 20h6" />
    <path d="M12 4v16" />
  </svg>
);

const ChecklistIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

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
    <>
      <div className="mode-switcher">
        <button
          className={`mode-button ${mode === 'plain' ? 'mode-active' : ''}`}
          onClick={() => setMode('plain')}
          aria-label="plain text mode"
        >
          <TextIcon /> Text
        </button>
        <button
          className={`mode-button ${mode === 'checkbox' ? 'mode-active' : ''}`}
          onClick={() => setMode('checkbox')}
          aria-label="checkbox mode"
        >
          <ChecklistIcon /> Checklist
        </button>
      </div>
      <div className="button-group">
        <button className="button" onClick={() => save()} aria-label="save">
          Save
        </button>
        <button
          className="button button-primary"
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
    </>
  );
}

export default React.memo(ActionButtonGroup);
