import { ShortcutType } from '../types';

// TODO: can map these shortcuts to a keycode and then use the same in Editor key bindings
export const SHORTCUTS: Array<ShortcutType> = [
  {
    key: '⌘ B',
    value: 'Bold',
  },
  { key: '⌘ I', value: 'Italic' },
  { key: '⌘ J', value: 'Code' },
  { key: '⌘ S', value: 'Save' },
  { key: '⌘ X', value: 'Clear' },
  { key: '⌘ C', value: 'Copy link' },
];
