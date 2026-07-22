import { z } from 'zod';
export const SAVE_SCHEMA_VERSION = 2;
export const SAVE_SLOTS = 4;
export const SaveRequestSchema = z.object({ slot: z.number().int().min(0).max(3), revision: z.number().int().nonnegative(), data: z.unknown() });
export type SaveRequest = z.infer<typeof SaveRequestSchema>;
export interface ApiError { error: string; requestId: string }
export const clamp = (value: number, min = 0, max = 100): number => Math.max(min, Math.min(max, value));
