import React from 'react';

export function ActionButtonGroup({
  clearState,
  saveState,
  copyLink,
}: {
  clearState: () => void;
  saveState: () => void;
  copyLink: () => Promise<any>;
}) {
  const copyStateMap = ['Copy link', 'Copying...', 'Link copied'];
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
    <div
      style={{
        justifyContent: 'flex-end',
        display: 'flex',
        marginRight: 36,
        paddingBottom: 20,
      }}
    >
      <button className='button' onClick={saveState}>
        Save
      </button>
      <button className='button' onClick={copy} disabled={copyState === 1}>
        {copyStateMap[copyState]}
      </button>
      <button className='button' onClick={clearState}>
        Clear
      </button>
    </div>
  );
}
