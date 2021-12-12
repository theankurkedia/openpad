import React from 'react';

function Overlay({
  children,
  visible,
}: {
  children: React.ReactElement;
  visible: boolean;
}) {
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

export default React.memo(Overlay);
