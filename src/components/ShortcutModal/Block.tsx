import React from 'react';
import { ShortcutType } from '../../types';

function ShortcutBlock({ shortcut }: { shortcut: ShortcutType }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: 4,
      }}
    >
      <span style={{ minWidth: 200 }}>{shortcut.key}</span>
      <span style={{ minWidth: 120 }}>{shortcut.value}</span>
    </div>
  );
}

export default React.memo(ShortcutBlock);
