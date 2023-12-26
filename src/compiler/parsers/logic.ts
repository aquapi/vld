import vld from '..';
import { AndSchema, OrSchema } from '../../schema/types';
import expandMacro from './utils/expandMacro';
import SymbolSet from './utils/symbols';

// TODO: Inline union and intersection using macros
export const parseUnion = (schema: OrSchema) => {
    const condition = [], symbols = new SymbolSet;

    for (var item of schema.anyOf)
        condition.push(expandMacro(
            vld(item), symbols, 'o', true
        ));

    return symbols.inject(`return o=>${condition.join('||')}`);
}

export const parseIntersection = (schema: AndSchema) => {
    const condition = [], symbols = new SymbolSet;

    for (var item of schema.allOf)
        condition.push(expandMacro(
            vld(item), symbols, 'o', true
        ));

    return symbols.inject(`return o=>${condition.join('&&')}`);
}

