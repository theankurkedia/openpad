import React from 'react';
import ShortcutModalContent from './Content';
import Overlay from './Overlay';

function ShortcutModal() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const modalVisibleCallback = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === 'Slash') {
        event.preventDefault();
        setVisible((prev) => !prev);
        return;
      }
    };
    document.addEventListener('keydown', modalVisibleCallback);
    return () => {
      document.removeEventListener('keydown', modalVisibleCallback);
    };
  }, []);

  return (
    <Overlay visible={visible}>
      <ShortcutModalContent />
    </Overlay>
  );
}

export default React.memo(ShortcutModal);
