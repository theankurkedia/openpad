import { ShortcutType } from '../types';

export const FORMAT_SHORTCUTS: Array<ShortcutType> = [
  { key: '⌘ B', value: 'Bold' },
  { key: '⌘ I', value: 'Italic' },
  { key: '⌘ J', value: 'Code' },
];

export const ACTION_SHORTCUTS: Array<ShortcutType> = [
  { key: '⌘ S', value: 'Save' },
  { key: '⌘ C', value: 'Copy link' },
  { key: '⌘ X', value: 'Clear' },
  { key: '⌘ /', value: 'Shortcuts' },
];

export const SHORTCUTS: Array<ShortcutType> = [
  ...FORMAT_SHORTCUTS,
  ...ACTION_SHORTCUTS,
];
