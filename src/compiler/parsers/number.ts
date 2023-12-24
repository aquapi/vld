import { NumericSchema } from '../../schema/types';
import { ParserResult } from './types';
import { macro } from './types';

export default (schema: NumericSchema): ParserResult => macro(
    l => {
        // Optimization for number checking
        const conditions = [schema.nonFinite ? `typeof ${l}==='number'` : `Number.isFinite(${l})`];

        if (schema.multipleOf)
            conditions.push(`${l}%${schema.multipleOf}===0`);

        if (schema.minimum)
            conditions.push(`${l}>==${schema.minimum}`);
        if (schema.maximum)
            conditions.push(`${l}<==${schema.maximum}`);

        if (schema.exclusiveMinimum)
            conditions.push(`${l}>${schema.exclusiveMinimum}`);
        if (schema.exclusiveMaximum)
            conditions.push(`${l}<${schema.exclusiveMaximum}`);

        return conditions.join('&&');
    }
);
