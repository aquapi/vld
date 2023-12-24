import { ConstSchema } from '../../schema/types';
import { macro } from './types';

export default (schema: ConstSchema) => {
    const ed = `===${JSON.stringify(schema.const)}`;

    return macro(l => l + ed);
}
