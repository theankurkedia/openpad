import React from 'react';
import { ShortcutType } from '../../types';

function ShortcutBlock({ shortcut }: { shortcut: ShortcutType }) {
  const keys = shortcut.key.split(' ');
  return (
    <div className="shortcut-row">
      <span className="shortcut-key">
        {keys.map((k, i) => (
          <kbd key={i}>{k}</kbd>
        ))}
      </span>
      <span className="shortcut-value">{shortcut.value}</span>
    </div>
  );
}

export default React.memo(ShortcutBlock);
