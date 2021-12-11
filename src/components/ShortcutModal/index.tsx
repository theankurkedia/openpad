import React, { Suspense } from 'react';
import Overlay from './Overlay';
const ShortcutModalContent = React.lazy(() => import('./Content'));

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

export default React.memo(ShortcutModal);
