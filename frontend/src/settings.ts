/**
 * Settings: font scale, dialogue speed, reduced-motion override, skip-read.
 * Persist `bon-nam-settings-*`. Helper tính giá trị hiệu dụng cho render.
 */
export type FontScale = 'small' | 'normal' | 'large';
export type DialogueSpeed = 'slow' | 'normal' | 'fast';

export interface Settings {
  fontScale: FontScale;
  dialogueSpeed: DialogueSpeed;
  /** null = auto (theo OS prefers-reduced-motion); true/false = override. */
  reducedMotionOverride: boolean | null;
  skipRead: boolean;
}

const SETTINGS_KEY = 'bon-nam-settings';

export const FONT_SCALE_VALUES: Record<FontScale, number> = {
  small: 0.9,
  normal: 1,
  large: 1.15,
};

export const DIALOGUE_DELAY_VALUES: Record<DialogueSpeed, number> = {
  slow: 1200,
  normal: 650,
  fast: 300,
};

const DEFAULTS: Settings = {
  fontScale: 'normal',
  dialogueSpeed: 'normal',
  reducedMotionOverride: null,
  skipRead: false,
};

function isFontScale(v: unknown): v is FontScale {
  return v === 'small' || v === 'normal' || v === 'large';
}
function isDialogueSpeed(v: unknown): v is DialogueSpeed {
  return v === 'slow' || v === 'normal' || v === 'fast';
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

/** Đọc settings từ localStorage, merge defaults. */
export function loadSettings(): Settings {
  const raw = readRaw(SETTINGS_KEY);
  if (!raw) return { ...DEFAULTS };
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      fontScale: isFontScale(parsed.fontScale) ? parsed.fontScale : DEFAULTS.fontScale,
      dialogueSpeed: isDialogueSpeed(parsed.dialogueSpeed)
        ? parsed.dialogueSpeed
        : DEFAULTS.dialogueSpeed,
      reducedMotionOverride:
        parsed.reducedMotionOverride === null ||
        parsed.reducedMotionOverride === true ||
        parsed.reducedMotionOverride === false
          ? parsed.reducedMotionOverride
          : DEFAULTS.reducedMotionOverride,
      skipRead: typeof parsed.skipRead === 'boolean' ? parsed.skipRead : DEFAULTS.skipRead,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

/** Ghi settings vào localStorage. */
export function saveSettings(s: Settings): void {
  writeRaw(SETTINGS_KEY, JSON.stringify(s));
}

/** fontScale → CSS scale (cho biến --font-scale). */
export function fontScaleValue(scale: FontScale): number {
  return FONT_SCALE_VALUES[scale] ?? FONT_SCALE_VALUES.normal;
}

/** dialogueSpeed → ms giữa dialogue beat. */
export function dialogueDelayMs(speed: DialogueSpeed): number {
  return DIALOGUE_DELAY_VALUES[speed] ?? DIALOGUE_DELAY_VALUES.normal;
}

/**
 * reduced-motion hiệu dụng. Override (true/false) thắng; null → auto theo OS.
 */
export function effectiveReducedMotion(s: Settings): boolean {
  if (s.reducedMotionOverride === true) return true;
  if (s.reducedMotionOverride === false) return false;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}