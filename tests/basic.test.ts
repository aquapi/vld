/// <reference types='bun-types' />
import { test, expect } from 'bun:test';
import { t, vld } from '..';

test('Primitives', () => {
    // Non-finite number type
    const num = vld(t.num);
    expect(num(9)).toBe(true);
    expect(num('a')).toBe(false);
    expect(num(NaN)).toBe(true);

    // Strict number type
    const snum = vld(t.snum);
    expect(snum(12)).toBe(true);
    expect(snum('b')).toBe(false);
    expect(snum(NaN)).toBe(false);

    // String type
    const str = vld(t.str);
    expect(str('xy')).toBe(true);
    expect(str(null)).toBe(false);

    // Boolean
    const bool = vld(t.bool);
    expect(bool(true)).toBe(true);
    expect(bool(false)).toBe(true);
    expect(bool(56)).toBe(false);

    // Null
    const nil = vld(t.nil);
    expect(nil(null)).toBe(true);
    expect(nil('')).toBe(false);
});
