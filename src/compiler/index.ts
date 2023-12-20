import { Schema } from '../schema/types';
import parseConstants from './parsers/consts';
import parseEnum from './parsers/enum';
import { ParserResult, macro } from './parsers/types';

const nullVld = macro(l => `${l}===null`), boolVld = macro(l => `typeof ${l}==='boolean'`);

export const vld = (schema: Schema): ParserResult => {
    // Validate normal types
    if ('type' in schema)
        switch (schema.type) {
            // Type with no additional thing
            case 'null': return nullVld;
            case 'boolean': return boolVld;

            // TODO: Need more type
        }

    // Validate enum types
    if ('enum' in schema) return parseEnum(schema);

    // Validate constant
    if ('const' in schema) return parseConstants(schema);
}
