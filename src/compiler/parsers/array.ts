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

    // Can be single line
    if (!schema.items || schema.items === true)
        return symbols.inject(`return o=>${conditions.join('&&')}`);

    if (schema.prefixItems && schema.prefixItems.length > 0) {
        const
            // Check
            condition = `if(!(${expandMacro(
                vld(schema.items), symbols, 'o[i]'
            )}))return false;`,
            // Function parts
            parts = [`return o=>{`];

        // Check for extra condition
        parts.push(`if(!(${conditions.join('&&')}))return false;`);

        // Check for tuple type
        parts.push(`let l=o.length-1;while(l>${schema.prefixItems.length - 1}){${condition}--i}`);

        return symbols.inject(parts.join(''));
    }

    // Optimization for schema.items
    conditions.push(`o.every(${symbols.put(vld(schema.items))})`);
    return symbols.inject(`return o=>${conditions.join('&&')}`);
}
