import * as t from './validators';
export { t };

export const vld = <T extends t.Validator>(t: T): (o: any) => t.Infer<T> | null => {
    const cast = t.cast,
        // Expression to compose
        castExpr = cast ? `o=${cast.macro ? cast.macro('o') : 'f(o)'}` : null,
        // Final expression
        finalExpr = t.macro ? t.macro('o') : `d(o)`,
        // Symbols to add to function scope
        symbols = [], symbolValues = [];

    // Check whether macros are available
    if (cast && !cast.macro) {
        symbols.push('f');
        symbolValues.push(cast.f);
    }

    if (!t.macro) {
        symbols.push('d');
        symbolValues.push(t.f);
    }

    return Function(...symbols, 'return o=>' + (castExpr === null ? '' : `{${castExpr};return `)
        + `${finalExpr}?o:null` + (castExpr === null ? '' : '}'))(...symbolValues);
}
