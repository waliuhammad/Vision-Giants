import { HttpsError } from 'firebase-functions/v2/https';

/**
 * Server-side validation for public submissions. This is the source of truth: the website's
 * client-side checks (src/components/ui/ContactForm.tsx, ApplicationForm.tsx) only mirror it.
 */
export type Input = Record<string, unknown>;

export const invalid = (field: string): never => {
  throw new HttpsError('invalid-argument', `Invalid value for "${field}"`, { field });
};

export function asInput(data: unknown): Input {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpsError('invalid-argument', 'Invalid request');
  return data as Input;
}

/** Trimmed string between `min` and `max` characters. Missing values count as ''. */
export function text(input: Input, key: string, max: number, min = 0): string {
  const raw = input[key] ?? '';
  if (typeof raw !== 'string') return invalid(key);
  const value = raw.trim();
  if (value.length < min || value.length > max) return invalid(key);
  return value;
}

export function email(input: Input, key: string): string {
  const value = text(input, key, 200, 3);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return invalid(key);
  return value;
}

/** Optional http(s) URL. */
export function url(input: Input, key: string): string {
  const value = text(input, key, 500);
  if (!value) return '';
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return invalid(key);
    return parsed.toString();
  } catch {
    return invalid(key);
  }
}

export function requireConsent(input: Input): void {
  if (input.consent !== true) invalid('consent');
}
