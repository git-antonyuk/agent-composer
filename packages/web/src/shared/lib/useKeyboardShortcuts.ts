import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const SHORTCUTS = {
  COPY: { key: 'c', ctrl: true, description: 'Copy prompt' },
  DOWNLOAD: { key: 'd', ctrl: true, description: 'Download prompt' },
  SELECT_ALL: { key: 'a', ctrl: true, shift: true, description: 'Select all agents' },
  DESELECT_ALL: { key: 'e', ctrl: true, shift: true, description: 'Deselect all' },
  TOGGLE_VIEW: { key: 'k', ctrl: true, description: 'Toggle List/Canvas view' },
  SEARCH: { key: 'f', ctrl: true, description: 'Focus search' },
} as const;
