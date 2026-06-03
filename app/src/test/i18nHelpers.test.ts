import { describe, it, expect } from 'vitest';
import { tArray } from '@/lib/i18n-helpers';

describe('tArray', () => {
  // Simple mock: t function that resolves dotted keys from an object
  const makeT = (translations: Record<string, unknown>) => {
    return (key: string) => {
      const parts = key.split('.');
      let current: unknown = translations;
      for (const part of parts) {
        if (current && typeof current === 'object') {
          current = (current as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      return current;
    };
  };

  it('returns the array when key exists and is an array', () => {
    const t = makeT({ foo: { bar: ['a', 'b', 'c'] } });
    expect(tArray(t, 'foo.bar')).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array when key does not exist', () => {
    const t = makeT({});
    expect(tArray(t, 'missing.key')).toEqual([]);
  });

  it('returns empty array when value is not an array', () => {
    const t = makeT({ foo: 'string-value' });
    expect(tArray(t, 'foo')).toEqual([]);
  });

  it('returns empty array when value is an object', () => {
    const t = makeT({ foo: { nested: 'value' } });
    expect(tArray(t, 'foo')).toEqual([]);
  });

  it('handles empty string key', () => {
    const t = makeT({});
    expect(tArray(t, '')).toEqual([]);
  });

  it('handles null translation return', () => {
    const t = () => null;
    expect(tArray(t, 'any.key')).toEqual([]);
  });
});
