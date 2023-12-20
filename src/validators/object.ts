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
export const obj = <T extends Record<string, Validator>>(v: T): Validator<{
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
    const cast = v.cast,
        // Store function scope symbols
        symbols = [], symbolValues = [],
        // Main func
        fn = `return o=>{if(!Array.isArray(o))return false;`
            + `for(var v of o)` + (cast ? `{v=${cast.macro ? cast.macro('v') : 'd(v)'};` : '')
            + `if(!${v.macro ? `(${v.macro('v')})` : 'f(v)'})return false`
            + (cast ? '}' : ';')
            + `return true}`;

    // Macro check
    if (!v.macro) {
        symbols.push('f');
        symbolValues.push(v.f);
    }

    if (cast && !cast.macro) {
        symbols.push('d');
        symbolValues.push(cast.f);
    }

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
export const tuple = <T extends Validator[]>(...v: T): Validator<Spread<T>> =>
    // @ts-ignore
    obj(v);

/**
 * Create a dictionary validator
 */
export const dict = <V extends Validator>(v: V): Validator<Record<string, Infer<V>>> => {
    const
        cast = v.cast,

        // Create the function body
        fn = `return o=>{if(typeof o!=='object')return false;`
            + `for(var k in o)` + (cast ? `{o[k]=${cast.macro ? cast.macro('o[k]') : 'a(o[k])'};` : '')
            + `if(!(${v.macro ? v.macro('o[k]') : 'b(o[k])'}))return false`
            + (cast ? '}' : ';')
            + `return true}`,

        // Store function scope symbols
        symbols = [],
        symbolValues = [];

    // Macro check
    if (cast && !cast.macro) {
        symbols.push('a');
        symbolValues.push(cast.f);
    }

    if (!v.macro) {
        symbols.push('b');
        symbolValues.push(v.f);
    }

    return {
        f: Function(...symbols, fn)(...symbolValues)
    };
};
