import React from 'react';

function Overlay({
  children,
  visible,
}: {
  children: React.ReactElement;
  visible: boolean;
}) {
  return (
    <div className={`modal-overlay ${!visible ? 'hidden' : ''}`}>
      {children}
    </div>
  );
}

export default React.memo(Overlay);
