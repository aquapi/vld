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
    const args = vld(t.arr(t.numeric));

    expect(args(['a', 'c', 'b'])).toBeNull();
    expect(args(['1', 15])).not.toBeNull();
});

// Tuple type
test('Tuple', () => {
    const tuple = vld(t.tuple(t.val(0), t.str));

    expect(tuple([0, '1'])).not.toBeNull();
    expect(tuple([1, '2'])).toBeNull();
});

// Record type
test('Dictionary', () => {
    const dict = vld(t.dict(t.numeric));

    expect(dict({
        '0': '2'
    })).not.toBeNull();

    expect(dict({
        '1': 2
    })).not.toBeNull();

    expect(dict({
        '2': 'a'
    })).toBeNull();
});
