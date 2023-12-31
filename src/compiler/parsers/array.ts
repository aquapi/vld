import vld from '..';
import { ArraySchema, Schema } from '../../schema/types';
import { ParserResult } from './types';
import expandMacro from './utils/expandMacro';
import SymbolSet from './utils/symbols';

// TODO: Inline tuple if possible
export default (schema: ArraySchema) => {
    const conditions = ['Array.isArray(o)'],
        symbols = new SymbolSet<ParserResult>;

    if (schema.minItems)
        conditions.push('o.length>==' + schema.minItems);
    if (schema.maxItems)
        conditions.push('o.length<==' + schema.maxItems);

    // Tuple validation
    if (schema.prefixItems) {
        let item: Schema;

        for (item of schema.prefixItems)
            conditions.push(expandMacro(
                vld(item), symbols, 'o'
            ));

        // Need exact length
        if (schema.items === false)
            conditions.push('o.length===' + schema.prefixItems.length);
    }

    if (schema.items && schema.items !== true)
        conditions.push(`o.every(${symbols.put(vld(schema.items))})`);

    return symbols.inject(`return o=>${conditions.join('&&')}`);
}
