import type { GameState } from '@game/game-core';
import { content, surprisesById } from '@game/game-content';

const READ_KEY = 'bon-nam-read-beats';

export type BeatKind = 'event' | 'activity' | 'surprise';

export function beatKey(kind: BeatKind, id: string, index: number): string {
  return `${kind}:${id}:${index}`;
}

export function listReadBeats(): Set<string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(READ_KEY) ?? '[]') as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []);
  } catch {
    return new Set();
  }
}

export function markBeatRead(kind: BeatKind, id: string, index: number): void {
  const read = listReadBeats();
  read.add(beatKey(kind, id, index));
  try { localStorage.setItem(READ_KEY, JSON.stringify([...read])); } catch { /* storage unavailable */ }
}

export function firstUnreadBeat(kind: BeatKind, id: string, beatCount: number, skipRead: boolean): number {
  if (!skipRead || beatCount < 2) return 0;
  const read = listReadBeats();
  for (let index = 0; index < beatCount; index += 1) {
    if (!read.has(beatKey(kind, id, index))) return index;
  }
  return beatCount - 1;
}

export interface TimelineEntry { month: number; season: number; kind: 'event' | 'activity' | 'surprise' | 'choice'; label: string }

export function parseTimeline(history: GameState['history']): TimelineEntry[] {
  return history.flatMap((raw) => {
    const match = /^m(\d+):(activity|event|surprise):([^:]+)(?::([^:]+))?$/.exec(raw);
    if (!match) return [];
    const month = Number(match[1]);
    const sourceKind = match[2] as 'activity' | 'event' | 'surprise';
    const id = match[3]!;
    const choiceId = match[4];
    const source = sourceKind === 'activity'
      ? content.activities.find((item) => item.id === id)
      : sourceKind === 'event'
        ? content.events.find((item) => item.id === id)
        : surprisesById[id];
    const label = sourceKind === 'activity'
      ? content.activities.find((item) => item.id === id)?.name
      : sourceKind === 'event'
        ? content.events.find((item) => item.id === id)?.title
        : surprisesById[id]?.title;
    const base: TimelineEntry = { month, season: Math.floor((month - 1) / 3) + 1, kind: sourceKind, label: label ?? id };
    if (!choiceId) return [base];
    const choice = 'choices' in (source ?? {}) ? (source as { choices: Array<{ id: string; label: string }> }).choices.find((item) => item.id === choiceId) : undefined;
    return [base, { month, season: base.season, kind: 'choice' as const, label: choice?.label ?? choiceId }];
  });
}
