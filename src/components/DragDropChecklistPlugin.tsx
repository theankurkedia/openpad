import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $getRoot } from 'lexical';
import { ListItemNode, ListNode } from '@lexical/list';

function getChecklistItem(target: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== document.body) {
    if (
      el.classList.contains('editor-list-item-checked') ||
      el.classList.contains('editor-list-item-unchecked')
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export default function DragDropChecklistPlugin() {
  const [editor] = useLexicalComposerContext();
  const handleRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const hoveredItemRef = useRef<HTMLElement | null>(null);
  const activeItemRef = useRef<HTMLElement | null>(null);
  const dragKeyRef = useRef<string | null>(null);
  const dropKeyRef = useRef<string | null>(null);
  const dropPosRef = useRef<'before' | 'after'>('after');
  const keyMap = useRef(new WeakMap<HTMLElement, string>());
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;

    // Create drag handle
    const handle = document.createElement('div');
    handle.className = 'checklist-drag-handle';
    handle.draggable = true;
    handle.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5.5" cy="3.5" r="1.5"/>
      <circle cx="10.5" cy="3.5" r="1.5"/>
      <circle cx="5.5" cy="8" r="1.5"/>
      <circle cx="10.5" cy="8" r="1.5"/>
      <circle cx="5.5" cy="12.5" r="1.5"/>
      <circle cx="10.5" cy="12.5" r="1.5"/>
    </svg>`;
    handleRef.current = handle;
    document.body.appendChild(handle);

    // Create drop indicator line
    const indicator = document.createElement('div');
    indicator.className = 'checklist-drop-indicator';
    indicatorRef.current = indicator;
    document.body.appendChild(indicator);

    // ── Key tracking ──

    function seedKeys() {
      editor.getEditorState().read(() => {
        const lexRoot = $getRoot();
        for (const child of lexRoot.getChildren()) {
          if (child instanceof ListNode) {
            for (const item of child.getChildren()) {
              const el = editor.getElementByKey(item.getKey());
              if (el) keyMap.current.set(el as HTMLElement, item.getKey());
            }
          }
        }
      });
    }

    seedKeys();

    const removeListener = editor.registerMutationListener(
      ListItemNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            if (type === 'destroyed') continue;
            const el = editor.getElementByKey(key);
            if (el) keyMap.current.set(el as HTMLElement, key);
          }
        });
      }
    );

    function getKey(el: HTMLElement): string | null {
      return keyMap.current.get(el) ?? null;
    }

    // ── Handle positioning ──

    function cancelHideTimeout() {
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }

    function positionHandle(item: HTMLElement) {
      const rect = item.getBoundingClientRect();
      handle.style.display = 'flex';
      handle.style.top = `${rect.top + rect.height / 2 - 14}px`;
      handle.style.left = `${rect.right - 32}px`;
    }

    function showHandle(item: HTMLElement) {
      cancelHideTimeout();
      // Only reposition if the hovered item actually changed
      if (hoveredItemRef.current === item) return;
      hoveredItemRef.current = item;
      activeItemRef.current = item;
      positionHandle(item);
    }

    function scheduleHide() {
      cancelHideTimeout();
      hideTimeoutRef.current = window.setTimeout(() => {
        handle.style.display = 'none';
        hoveredItemRef.current = null;
        hideTimeoutRef.current = null;
      }, 100);
    }

    function hideHandleImmediate() {
      cancelHideTimeout();
      handle.style.display = 'none';
      hoveredItemRef.current = null;
    }

    function hideIndicator() {
      indicator.style.display = 'none';
    }

    // ── Event handlers ──

    function onMouseMove(e: MouseEvent) {
      if (dragKeyRef.current) return;
      const item = getChecklistItem(e.target as HTMLElement);
      if (item) {
        showHandle(item);
      } else {
        scheduleHide();
      }
    }

    function onMouseLeave() {
      if (!dragKeyRef.current) scheduleHide();
    }

    // Keep handle visible when mouse enters it
    function onHandleMouseEnter() {
      cancelHideTimeout();
    }

    function onHandleMouseLeave() {
      if (!dragKeyRef.current) scheduleHide();
    }

    function onDragStart(e: DragEvent) {
      const item = activeItemRef.current;
      if (!item) return;
      const key = getKey(item);
      if (!key) return;

      dragKeyRef.current = key;
      item.classList.add('checklist-item-dragging');
      e.dataTransfer!.effectAllowed = 'move';
      e.dataTransfer!.setDragImage(item, 0, 0);
    }

    function onDragOver(e: DragEvent) {
      if (!dragKeyRef.current) return;
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';

      const item = getChecklistItem(e.target as HTMLElement);
      if (!item || item === activeItemRef.current) {
        hideIndicator();
        return;
      }

      const key = getKey(item);
      if (!key) return;

      const rect = item.getBoundingClientRect();
      const pos: 'before' | 'after' =
        e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';

      dropKeyRef.current = key;
      dropPosRef.current = pos;

      const rootRect = root!.getBoundingClientRect();
      indicator.style.display = 'block';
      indicator.style.left = `${rootRect.left}px`;
      indicator.style.width = `${rootRect.width}px`;
      indicator.style.top =
        pos === 'before' ? `${rect.top - 2}px` : `${rect.bottom - 2}px`;
    }

    function onDrop(e: DragEvent) {
      e.preventDefault();
      const srcKey = dragKeyRef.current;
      const tgtKey = dropKeyRef.current;
      const pos = dropPosRef.current;
      resetDrag();

      if (!srcKey || !tgtKey || srcKey === tgtKey) return;

      editor.update(() => {
        const src = $getNodeByKey(srcKey);
        const tgt = $getNodeByKey(tgtKey);
        if (
          !(src instanceof ListItemNode) ||
          !(tgt instanceof ListItemNode)
        )
          return;

        src.remove();
        if (pos === 'before') {
          tgt.insertBefore(src);
        } else {
          tgt.insertAfter(src);
        }
      });
    }

    function onDragEnd() {
      resetDrag();
    }

    function resetDrag() {
      activeItemRef.current?.classList.remove('checklist-item-dragging');
      dragKeyRef.current = null;
      dropKeyRef.current = null;
      hideHandleImmediate();
      hideIndicator();
    }

    root.addEventListener('mousemove', onMouseMove);
    root.addEventListener('mouseleave', onMouseLeave);
    handle.addEventListener('mouseenter', onHandleMouseEnter);
    handle.addEventListener('mouseleave', onHandleMouseLeave);
    handle.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragend', onDragEnd);

    return () => {
      cancelHideTimeout();
      root.removeEventListener('mousemove', onMouseMove);
      root.removeEventListener('mouseleave', onMouseLeave);
      handle.removeEventListener('mouseenter', onHandleMouseEnter);
      handle.removeEventListener('mouseleave', onHandleMouseLeave);
      handle.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
      document.removeEventListener('dragend', onDragEnd);
      removeListener();
      handle.remove();
      indicator.remove();
    };
  }, [editor]);

  return null;
}
