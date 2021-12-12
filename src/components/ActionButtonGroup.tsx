import React from 'react';

type ActionButtonGroupProps = {
  clear: () => void;
  save: () => void;
  copy: () => void;
  copyState: string;
};

function ActionButtonGroup({
  clear,
  save,
  copy,
  copyState,
}: ActionButtonGroupProps) {
  return (
    <div
      style={{
        justifyContent: 'flex-end',
        display: 'flex',
        paddingBottom: 24,
      }}
    >
      <button className='button' onClick={() => save()} aria-label='save'>
        Save
      </button>
      <button
        className='button'
        onClick={copy}
        disabled={copyState.includes('Copying')}
        aria-label='copy'
      >
        {copyState}
      </button>
      <button className='button' onClick={clear} aria-label='clear'>
        Clear
      </button>
    </div>
  );
}

export default React.memo(ActionButtonGroup);
