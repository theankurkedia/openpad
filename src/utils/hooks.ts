import { useEffect, useRef } from 'react';
import { LexicalEditor } from 'lexical';
import { getEncodedContent, getPlainText } from './Editor';

export function useAutoSave(editor: LexicalEditor | null, save: () => void) {
  const unchangedCount = useRef(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!editor) return;

    const checkAndSave = () => {
      const text = getPlainText(editor);
      const currentEncoded = getEncodedContent(editor);
      const urlData =
        new URLSearchParams(window.location.search).get('data') || '';

      if (
        (window.location.search && !text) ||
        (text && currentEncoded !== urlData)
      ) {
        save();
        unchangedCount.current = 5;
      } else {
        unchangedCount.current--;
        if (unchangedCount.current <= 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    intervalRef.current = setInterval(checkAndSave, 2 * 60 * 1000);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const text = getPlainText(editor);
      const currentEncoded = getEncodedContent(editor);
      const urlData =
        new URLSearchParams(window.location.search).get('data') || '';

      if (text && currentEncoded !== urlData) {
        save();
        e.preventDefault();
        e.returnValue = '';
        return 'Unsaved Changes';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [editor, save]);
}
