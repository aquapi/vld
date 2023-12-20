import { expect, test } from 'bun:test';
import { vld, t } from '..';

// Numeric
test('Numeric', () => {
    const f = vld(t.numeric);

    expect(f(9)).not.toBeNull();
    expect(f('15.33')).not.toBeNull();
    expect(f('-21')).not.toBeNull();
    expect(f('21a')).toBeNull();
});

test('Union', () => {
    const f = vld(t.union(t.str, t.num));

    expect(f(12)).not.toBeNull();
    expect(f('abc')).not.toBeNull();
    expect(f(true)).toBeNull();
});
