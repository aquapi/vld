import { StringSchema } from '../../schema/types';
import { macro } from './types';

export default (schema: StringSchema) => macro(
    l => {
        const conditions = [`typeof ${l}==='string'`];

        if (schema.pattern)
            conditions.push(`/${schema.pattern}/.test(${l})`);

        if (schema.minLength)
            conditions.push(`${l}.length>==${schema.minLength}`);
        if (schema.maxLength)
            conditions.push(`${l}.length<==${schema.maxLength}`);

        return conditions.join('&&');
    }
);
