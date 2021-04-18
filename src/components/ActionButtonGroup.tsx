import React from 'react';

type ActionButtonGroupProps = {
  clear: () => void;
  save: () => void;
  copy: () => void;
  copyStates: Array<string>;
  copyState: number;
};

function ActionButtonGroup({
  clear,
  save,
  copy,
  copyStates,
  copyState,
}: ActionButtonGroupProps) {
  return (
    <div
      style={{
        justifyContent: 'flex-end',
        display: 'flex',
        marginRight: 36,
        paddingBottom: 20,
      }}
    >
      <button className='button' onClick={() => save()} aria-label='save'>
        Save
      </button>
      <button
        className='button'
        onClick={copy}
        disabled={copyState === 1}
        aria-label='copy'
      >
        {copyStates[copyState]}
      </button>
      <button className='button' onClick={clear} aria-label='clear'>
        Clear
      </button>
    </div>
  );
}

export default ActionButtonGroup;
