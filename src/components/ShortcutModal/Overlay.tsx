import React from 'react';

function Overlay({
  children,
  visible,
  onClose,
}: {
  children: React.ReactElement;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`modal-overlay ${!visible ? 'hidden' : ''}`}
      onClick={onClose}
    >
      {children}
    </div>
  );
}

export default React.memo(Overlay);
