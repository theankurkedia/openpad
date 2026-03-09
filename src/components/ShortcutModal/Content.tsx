import React from 'react';
import { FORMAT_SHORTCUTS, ACTION_SHORTCUTS } from '../../constants';
import { ShortcutType } from '../../types';
import ShortcutBlock from './Block';

function ShortcutModalContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <div className="modal-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.01" />
            <path d="M10 8h.01" />
            <path d="M14 8h.01" />
            <path d="M18 8h.01" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
            <path d="M7 16h10" />
          </svg>
          Keyboard Shortcuts
        </div>
        <button className="modal-close" onClick={onClose} aria-label="close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="shortcut-section">
        <div className="shortcut-section-label">Formatting</div>
        {FORMAT_SHORTCUTS.map((shortcut: ShortcutType, key: number) => (
          <ShortcutBlock shortcut={shortcut} key={`format-${key}`} />
        ))}
      </div>

      <div className="shortcut-section">
        <div className="shortcut-section-label">Actions</div>
        {ACTION_SHORTCUTS.map((shortcut: ShortcutType, key: number) => (
          <ShortcutBlock shortcut={shortcut} key={`action-${key}`} />
        ))}
      </div>

      <div className="modal-footer">
        press <kbd>esc</kbd> to close
      </div>
    </div>
  );
}

export default React.memo(ShortcutModalContent);
