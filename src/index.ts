import t from './schema/builder';
import f from './compiler';
import { Schema } from './schema/types';
import { Infer } from './schema/infer';

export { t };

/**
 * Create a validator
 */
export const vld = <T extends Schema>(schema: T): ((o: any) => o is Infer<T>) => f(schema) as any;
