import { Infer, Validator } from './types';
import escapeStr from './utils/escapeStr';

const
    // Check whether the string is a valid variable name
    isVariable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
    // Return the valid accessor for the key ([0] or ['key'])
    wrapKey = (k: string) => isFinite(k as any) ? `'${escapeStr(k)}'` : k,
    // Return the accessor (.key or ['key'])
    accessor = (k: string) => isVariable.test(k) ? `.${k}` : `[${wrapKey(k)}]`;

/**
 * Create an object validator
 */
export const obj = <T extends Record<string | number, Validator>>(v: T): Validator<{
    [key in keyof T]: Infer<T[key]>
}> => {
    const conditions = [`typeof o==='object'&&o!==null`], casts = [],
        // Store symbols
        symbols = [], symbolValues = [];

    for (var key in v) {
        var
            cast = v[key].cast,
            macro = v[key].macro,
            value = `o${accessor(key)}`;

        // Try casting the value
        if (cast) {
            if (cast.macro)
                casts.push(`${value}=${cast.macro(value)}`);
            else {
                var newSymbol: string = `s${symbols.length}`;

                // Save the symbol
                symbols.push(newSymbol);
                symbolValues.push(cast.f);

                casts.push(`${value}=${newSymbol}(${value})`);
            }
        }

        // Invoke the macro if possible
        if (macro) conditions.push(macro(value));
        else {
            var newSymbol: string = `s${symbols.length}`;

            // Save the symbol to the function scope
            symbols.push(newSymbol);
            symbolValues.push(v[key].f);

            // Add the call into conditions
            conditions.push(`${newSymbol}(${value})`);
        }
    }

    const noCast = casts.length === 0;

    return {
        f: Function(
            ...symbols,
            'return o=>' + (noCast ? '' : `{${casts.join(';')};return `) + conditions.join('&&') + (noCast ? '' : '}')
        )(...symbolValues)
    };
}

/**
 * Create an array validator
 */
export const arr = <T extends Validator>(v: T): Validator<Infer<T>[]> => {
    const fn = `return o=>{for(var v of o)if(!${v.macro ? `(${v.macro('v')})` : 'f(v)'})return false;return true}`;

    return {
        f: v.macro ? Function(fn)() : Function('f', fn)(v.f)
    };
}

type Spread<T extends Validator[]> = T extends [infer Current, ...infer Rest]
    ? Rest extends Validator[] ? [Infer<Current>, ...Spread<Rest>] : [Infer<Current>]
    : []

/**
 * Create a tuple validator
 */
// @ts-ignore
export const tuple = <T extends Validator[]>(...v: T): Validator<Spread<T>> => obj(v);
