import React from 'react';
import { ShortcutType } from '../../types';

function ShortcutBlock({ shortcut }: { shortcut: ShortcutType }) {
  const keys = shortcut.key.split(' ');
  return (
    <div className="shortcut-row">
      <span className="shortcut-value">{shortcut.value}</span>
      <span className="shortcut-key">
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            <kbd>{k}</kbd>
            {i < keys.length - 1 && <span className="shortcut-plus">+</span>}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
}

export default React.memo(ShortcutBlock);
