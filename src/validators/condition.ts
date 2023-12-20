import { Infer, Validator } from './types';
import escapeStr from './utils/escapeStr';

type Union<T> = T extends [infer Current, ...infer Rest] ? (
    Current extends Validator ? Infer<Current> | Union<Rest> : unknown
) : never;

type Intersection<T> = T extends [infer Current, ...infer Rest] ? (
    Current extends Validator ? Infer<Current> & Union<Rest> : unknown
) : never;

/**
 * Combine types
 */
const createTypeMerger = <Type extends 'union' | 'inter'>(delim: '||' | '&&') => <T extends Validator[]>(...v: T): Validator<Type extends 'union' ? Union<T> : Intersection<T>> => {
    const conditions = [],
        // Store symbols
        symbols = [], symbolValues = [];

    for (var value of v) {
        // TODO: Merge cast
        if (value.cast) throw new Error('Cast is not supported with union or intersection yet!');

        // Invoke the macro if possible
        if (value.macro) conditions.push(`${value.macro('o')}`);
        else {
            var newSymbol: string = `s${symbols.length}`;

            // Save the symbol to the function scope
            symbols.push(newSymbol);
            symbolValues.push(value.f);

            // Add the call into conditions
            conditions.push(`${newSymbol}(o)`);
        }
    }

    // Merged conditions
    const merged = conditions.join(delim);

    return {
        f: Function(...symbols, 'return o=>' + merged)(...symbolValues),
        macro: symbols.length === 0 ? Function('return o=>' + `'${escapeStr(merged)}'`)() : null
    };
};

/**
 * Create an union validator
 */
export const union = createTypeMerger<'union'>('||');

/**
 * Create an intersection validator
 */
export const inter = createTypeMerger<'inter'>('&&');
