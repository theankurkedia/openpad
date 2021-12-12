import React from 'react';
import { SHORTCUTS } from '../../constants';
import { ShortcutType } from '../../types';
import ShortcutBlock from './Block';

function ShortcutModalContent() {
  return (
    <div
      style={{
        minWidth: '30%',
        borderRadius: 10,
        backgroundColor: '#282c34',
        boxShadow: '18px 18px 36px #181a1f,-18px -18px 36px #383e49',
        padding: 30,
        opacity: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          padding: 4,
          paddingBottom: 8,
        }}
      >
        <span style={{ minWidth: 200, fontWeight: 'bold' }}>Key Binding</span>
        <span style={{ minWidth: 120, fontWeight: 'bold' }}>Command</span>
      </div>
      {SHORTCUTS.map((shortcut: ShortcutType, key: number) => (
        <ShortcutBlock shortcut={shortcut} key={`shortcut-${key}`} />
      ))}
    </div>
  );
}

export default React.memo(ShortcutModalContent);
