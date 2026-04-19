import type { TFunction } from 'i18next';

/**
 * Safely call t() with returnObjects: true and return a string array.
 * When a translation key is missing, i18next returns the key string itself.
 * Calling .map() on a string iterates over individual characters, so we guard
 * with Array.isArray() and return an empty array for non-array results.
 */
export function tArray(t: TFunction, key: string): string[] {
  const result = t(key, { returnObjects: true });
  return Array.isArray(result) ? result : [];
}
