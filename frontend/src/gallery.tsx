import React from 'react';
import { content } from '@game/game-content';
import { useModalFocus } from './focus-trap';

const STORAGE_KEY = 'bon-nam-endings-seen';

const GROUP_LABELS: Record<'happy' | 'bad' | 'neutral', string> = {
  happy: 'Happy',
  bad: 'Nặng',
  neutral: 'Mở',
};

const GROUP_HINTS: Record<'happy' | 'bad' | 'neutral', string> = {
  happy: 'Kết thúc ấm áp — giữ tinh thần và các mối quan hệ.',
  bad: 'Kết thúc nặng — cẩn thận sức khỏe, nợ, tinh thần.',
  neutral: 'Kết thúc mở — hành trình chưa trọn vẹn nhưng tiếp tục.',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readSeen(): string[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
  return [];
}

function writeSeen(ids: string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function seenEndings(): Set<string> {
  return new Set(readSeen());
}

export function markEndingSeen(id: string): void {
  if (!id) return;
  const current = seenEndings();
  if (current.has(id)) return;
  current.add(id);
  writeSeen([...current]);
}

export interface EndingGalleryProps {
  onClose?: () => void;
}

function handleClose(onClose: (() => void) | undefined): void {
  onClose?.();
}

export function EndingGallery({ onClose }: EndingGalleryProps): React.ReactElement {
  const [seen, setSeen] = React.useState<Set<string>>(() => seenEndings());
  const dialogRef = useModalFocus<HTMLElement>();

  React.useEffect(() => {
    setSeen(seenEndings());
  }, []);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose(onClose);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const endings = content.endings;
  const seenCount = endings.filter((e) => seen.has(e.id)).length;
  const close = React.useCallback(() => handleClose(onClose), [onClose]);

  return (
    <div
      className="gallery-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        ref={dialogRef}
        className="gallery"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="gallery-heading">
          <div>
            <small>Bộ sưu tập</small>
            <h2 id="gallery-title">Kết thúc đã thấy</h2>
            <p className="gallery-progress">
              {seenCount} / {endings.length} kết thúc
            </p>
          </div>
          <button type="button" className="gallery-close" onClick={close} aria-label="Đóng bộ sưu tập">
            ×
          </button>
        </header>

        <ul className="gallery-grid" role="list">
          {endings.map((ending) => {
            const isSeen = seen.has(ending.id);
            return (
              <li
                key={ending.id}
                data-ending-id={ending.id}
                data-group={ending.group}
                className={`gallery-cell ${ending.group} ${isSeen ? 'is-seen' : 'is-locked'}`}
                aria-disabled={isSeen ? undefined : 'true'}
              >
                {isSeen ? (
                  <article>
                    <span className="gallery-cell-group">{GROUP_LABELS[ending.group]}</span>
                    <h3>{ending.name}</h3>
                    <p>{GROUP_HINTS[ending.group]}</p>
                  </article>
                ) : (
                  <article aria-label={`Kết thúc ${GROUP_LABELS[ending.group]} chưa mở khóa`}>
                    <span className="gallery-cell-group">{GROUP_LABELS[ending.group]}</span>
                    <div className="gallery-cell-lock" data-lock aria-hidden="true">?</div>
                    <p>{GROUP_HINTS[ending.group]}</p>
                  </article>
                )}
              </li>
            );
          })}
        </ul>

        <footer className="gallery-footer">
          <button type="button" className="advance" onClick={close}>
            Đóng
          </button>
          <p className="gallery-hint">Mở khóa mỗi kết thúc khi hoàn thành hành trình tương ứng.</p>
        </footer>
      </section>
    </div>
  );
}

export const Gallery = EndingGallery;
export default EndingGallery;