import vld from '..';
import { ArraySchema, Schema } from '../../schema/types';
import { ParserResult } from './types';
import expandMacro from './utils/expandMacro';
import SymbolSet from './utils/symbols';

export default (schema: ArraySchema) => {
    const conditions = [],
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

    const
        hasPrefixItems = schema.prefixItems && schema.prefixItems.length > 0,
        // Check
        loop = hasPrefixItems
            ? `let l=o.length,i=${schema.prefixItems.length};while(i<l)`
            : `let i;for(i of o)`,
        condition = `if(!(${expandMacro(
            vld(schema.items), symbols, hasPrefixItems ? 'o[i]' : 'i'
        )}))`;

    return symbols.inject(
        `return o=>{if(!(${conditions.join('&&')}))return false;` + loop +
        (hasPrefixItems ? `{${condition}++i}` : condition)
    );
}
