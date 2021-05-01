import React, { Suspense } from 'react';
// import ShortcutModalContent from './Content';
const ShortcutModalContent = React.lazy(() => import('./Content'));

function Overlay({ children, visible }: { children: any; visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(40, 44, 52, 0.5)',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        visibility: !visible ? 'hidden' : undefined,
      }}
    >
      {children}
    </div>
  );
}

function ShortcutModal() {
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
    <Overlay visible={visible}>
      <Suspense fallback={<div>Loading...</div>}>
        <ShortcutModalContent />
      </Suspense>
    </Overlay>
  );
}

export default ShortcutModal;
