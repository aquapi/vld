import { ConstSchema, Value } from '../../schema/types';
import { macro } from './types';

export default (schema: ConstSchema) => {
    const ed = `===${JSON.stringify(schema.const)}`;

    return macro<T>(l => l + ed);
}
