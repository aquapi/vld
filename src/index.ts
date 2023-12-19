import * as t from './validators';
export { t };

export const vld = <T extends t.Validator>(t: T): (o: any) => t.Infer<T> | null => {
    const cast = t.cast,
        // Expression to compose
        castExpr = cast ? `(${cast.macro ? cast.macro('o') : 'f(o)'})` : 'o',
        // Final expression
        finalExpr = t.macro ? t.macro(castExpr) : `d(${castExpr})`,
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

    return Function(...symbols, `return o=>${finalExpr}?o:null`)(...symbolValues);
}
