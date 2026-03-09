import React from 'react';
import { SHORTCUTS } from '../../constants';
import { ShortcutType } from '../../types';
import ShortcutBlock from './Block';

function ShortcutModalContent() {
  return (
    <div className="modal-content">
      <div className="modal-title">Keyboard Shortcuts</div>
      {SHORTCUTS.map((shortcut: ShortcutType, key: number) => (
        <ShortcutBlock shortcut={shortcut} key={`shortcut-${key}`} />
      ))}
    </div>
  );
}

export default React.memo(ShortcutModalContent);
