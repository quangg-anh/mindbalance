import React from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function trapTabKey(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (item) => !item.hidden && item.getAttribute('aria-hidden') !== 'true',
  );
  if (items.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function useModalFocus<T extends HTMLElement>(open = true): React.RefObject<T | null> {
  const ref = React.useRef<T>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = ref.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();
    return () => triggerRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => trapTabKey(dialog, event);
    dialog.addEventListener('keydown', onKeyDown);
    return () => dialog.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return ref;
}
