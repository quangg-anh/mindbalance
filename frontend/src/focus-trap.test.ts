import { afterEach, describe, expect, it } from 'vitest';
import { trapTabKey } from './focus-trap';

afterEach(() => { document.body.innerHTML = ''; });

describe('modal keyboard focus', () => {
  it('wraps Tab from last control to first', () => {
    document.body.innerHTML = '<section><button id="first">Đầu</button><button id="last">Cuối</button></section>';
    const dialog = document.querySelector('section')!;
    const first = document.querySelector<HTMLButtonElement>('#first')!;
    const last = document.querySelector<HTMLButtonElement>('#last')!;
    last.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    trapTabKey(dialog, event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it('wraps Shift+Tab from first control to last', () => {
    document.body.innerHTML = '<section><button id="first">Đầu</button><button id="last">Cuối</button></section>';
    const dialog = document.querySelector('section')!;
    const first = document.querySelector<HTMLButtonElement>('#first')!;
    const last = document.querySelector<HTMLButtonElement>('#last')!;
    first.focus();
    trapTabKey(dialog, new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }));
    expect(document.activeElement).toBe(last);
  });
});
