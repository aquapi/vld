/// <reference types='bun-types' />
import { expect, test } from 'bun:test';
import { vld, t } from '..';

test('Object', () => {
    const person = vld(
        t.obj({
            name: t.str,
            age: t.fnum,
        })
    );

    // Some tests
    expect(
        person({
            name: 'Reve',
            age: 15
        })
    ).not.toBeNull();

    expect(
        person({
            age: 15
        })
    ).toBeNull();
});

// Array type
test('Array', () => {
    const args = vld(t.arr(t.str));

    expect(args(['a', 'c', 'b'])).not.toBeNull();
    expect(args(['a', 15])).toBeNull();
});

// Tuple type
test('Tuple', () => {
    const tuple = vld(t.tuple(t.val(0), t.str));

    expect(tuple([0, '1'])).not.toBeNull();
    expect(tuple([1, '2'])).toBeNull();
});
