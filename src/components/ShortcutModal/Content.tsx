import React from 'react';
import { SHORTCUTS } from '../../constants';

function ShortcutBlock({ shortcut }: { shortcut: any }) {
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

function ShortcutModalContent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const modalVisibleCallback = (event: any) => {
      if (event.metaKey && event.code === 'Slash') {
        event.preventDefault();
        setVisible(!visible);
        return;
      }
    };
    document.addEventListener('keydown', modalVisibleCallback);
    return () => {
      document.removeEventListener('keydown', modalVisibleCallback);
    };
  }, [visible]);

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
      {SHORTCUTS.filter((val) => val.selection !== false).map(
        (shortcut: any, key: number) => (
          <ShortcutBlock
            shortcut={shortcut}
            key={`non-selection-shortcut-${key}`}
          />
        )
      )}
      {SHORTCUTS.filter((val) => val.selection === false).map(
        (shortcut: any, key: number) => (
          <ShortcutBlock
            shortcut={shortcut}
            key={`selection-shortcut-${key}`}
          />
        )
      )}
    </div>
  );
}

export default React.memo(ShortcutModalContent);
