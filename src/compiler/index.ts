import { Schema } from '../schema/types';

import parseConstants from './parsers/consts';
import parseEnum from './parsers/enum';
import parseNumber from './parsers/number';
import parseString from './parsers/string';
import parseObject from './parsers/object';
import parseArray from './parsers/array';

import { ParserResult, macro } from './parsers/types';

const
    nullVld = macro(l => `${l}===null`),
    boolVld = macro(l => `typeof ${l}==='boolean'`);

export default (schema: Schema): ParserResult => {
    // Validate normal types
    if ('type' in schema)
        switch (schema.type) {
            // Type with no additional thing
            case 'null': return nullVld;
            case 'boolean': return boolVld;

            case 'number':
            case 'integer':
                return parseNumber(schema);

            case 'string':
                return parseString(schema);

            case 'object':
                return parseObject(schema);

            case 'array':
                return parseArray(schema);
        }

    // Validate enum types
    if ('enum' in schema)
        return parseEnum(schema);

    // Validate constant
    if ('const' in schema)
        return parseConstants(schema);
}
