import vld from '..';

import { ObjectSchema } from '../../schema/types';
import { ParserResult } from './types';

import escapeQuote from './utils/escapeQuote';
import expandMacro from './utils/expandMacro';
import SymbolSet from './utils/symbols';

const
    // Check whether the string is a valid variable name
    isVariable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,

    // Return the valid accessor for the key ([0] or ['key'])
    wrapKey = (k: string) => isFinite(k as any) ? `'${escapeQuote(k)}'` : k,

    // Return the accessor (.key or [key])
    getAccessor = (k: string) => isVariable.test(k) ? `.${k}` : `[${wrapKey(k)}]`,

    // Create an object for checking required properties
    mapRequired = (required?: string[]) => {
        if (!required) return null;

        const o = {};

        for (var item of required)
            o[item] = null;

        return o;
    };

export default (schema: ObjectSchema) => {
    const conditions = [`typeof o==='object'&&o!==null`],
        symbols = new SymbolSet<ParserResult>,
        props = schema.properties,
        required = mapRequired(schema.required);

    // Loop through all schema properties
    for (var key in props) {
        var
            // Get the value of the current key in the object
            value = `o${getAccessor(key)}`,
            // Does inlining if possible
            check = expandMacro(vld(props[key]), symbols, value);

        // Check for required key
        conditions.push(required === null || required[key] !== null ? `(!${value}||${check})` : check);
    }

    return symbols.inject(`return o=>${conditions.join('&&')}`);
};
