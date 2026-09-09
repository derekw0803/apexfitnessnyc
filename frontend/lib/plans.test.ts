import { describe, expect, it } from 'vitest';
import { formatDollars, getPlan, PLANS } from '@/lib/plans';

describe('formatDollars', () => {
  it('formats whole-dollar amounts with no decimal places', () => {
    expect(formatDollars(30000)).toBe('300');
  });

  it('formats amounts that include cents', () => {
    expect(formatDollars(30050)).toBe('300.5');
  });

  it('formats amounts with two significant cent digits', () => {
    expect(formatDollars(19999)).toBe('199.99');
  });

  it('formats zero as "0"', () => {
    expect(formatDollars(0)).toBe('0');
  });

  it('adds thousands separators for large amounts', () => {
    expect(formatDollars(123456700)).toBe('1,234,567');
  });
});

describe('getPlan', () => {
  it('returns the matching plan for a known id', () => {
    const plan = getPlan('program-1-month');
    expect(plan).toBeDefined();
    expect(plan?.name).toBe('1-Month Program');
    expect(plan?.amount).toBe(30000);
  });

  it('returns undefined for an unknown id', () => {
    expect(getPlan('not-a-real-plan')).toBeUndefined();
  });

  it('returns undefined for an empty id', () => {
    expect(getPlan('')).toBeUndefined();
  });
});

describe('PLANS', () => {
  it('has a unique id for every plan', () => {
    const ids = PLANS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every plan a positive integer cent amount', () => {
    for (const plan of PLANS) {
      expect(Number.isInteger(plan.amount)).toBe(true);
      expect(plan.amount).toBeGreaterThan(0);
    }
  });

  it('flags the booking-required plans correctly', () => {
    const coaching = getPlan('coaching-1-on-1');
    const oneMonth = getPlan('program-1-month');
    expect(coaching?.requiresBooking).toBe(true);
    expect(oneMonth?.requiresBooking).toBeUndefined();
  });
});
