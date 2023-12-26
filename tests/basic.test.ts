/// <reference types='bun-types' />
import { test, expect } from 'bun:test';
import { t, vld } from '../src';

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

    // Debug log
    console.log('Number:', num.toString());
    console.log('Strict number:', snum.toString());
    console.log('String:', str.toString());
    console.log('Boolean:', bool.toString());
    console.log('Null:', nil.toString());
});

test('Object', () => {
    const obj = vld(t.obj({
        name: t.str,
        age: t.opt(t.num),
        level: t.enum(1, 2, 3)
    }));

    expect(obj({
        name: 'A',
        level: 4
    })).toBe(false);
    expect(obj({
        name: 'B',
        level: 1
    })).toBe(true);
    expect(obj({
        name: 'C',
        age: '23',
        level: 2
    })).toBe(false);

    // Debug log
    console.log('Object:', obj.toString());
});

test('Array', () => {
    const arr = vld(t.arr(
        t.union(t.str, t.num)
    ));

    expect(arr(['1', 2, '3', 4])).toBe(true);
    expect(arr([1, 2, null])).toBe(false);

    // Array
    console.log('Array:', arr.toString());
});
