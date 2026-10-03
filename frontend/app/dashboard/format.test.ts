import { describe, expect, it } from 'vitest';
import { formatJsonbEntries, formatDate } from './format';

describe('formatJsonbEntries', () => {
  it('returns an empty list for null/undefined', () => {
    expect(formatJsonbEntries(null)).toEqual([]);
    expect(formatJsonbEntries(undefined)).toEqual([]);
  });

  it('returns an empty list for non-object values (defensive against bad data)', () => {
    expect(formatJsonbEntries('not an object')).toEqual([]);
    expect(formatJsonbEntries(42)).toEqual([]);
    expect(formatJsonbEntries(['bench', 'squat'])).toEqual([]);
  });

  it('humanizes snake_case and camelCase keys', () => {
    expect(formatJsonbEntries({ bench_press: 225, oneRepMax: 315 })).toEqual([
      { label: 'Bench Press', value: '225' },
      { label: 'One Rep Max', value: '315' },
    ]);
  });

  it('renders a placeholder for null/empty values instead of blank text', () => {
    expect(formatJsonbEntries({ bench: null, squat: '' })).toEqual([
      { label: 'Bench', value: '—' },
      { label: 'Squat', value: '—' },
    ]);
  });

  it('stringifies nested values rather than crashing', () => {
    expect(formatJsonbEntries({ weekly: { mon: 5, tue: 3 } })).toEqual([
      { label: 'Weekly', value: '{"mon":5,"tue":3}' },
    ]);
  });
});

describe('formatDate', () => {
  it('returns a placeholder for null/undefined', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  it('formats a plain ISO date string', () => {
    expect(formatDate('2026-09-08')).toBe('Sep 8, 2026');
  });

  it('passes through a non-parseable string rather than showing Invalid Date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
