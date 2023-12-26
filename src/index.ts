import f from './compiler';
import { Schema, Infer } from './schema';

export * from './schema';

/**
 * Create a validator
 */
export const vld = <T extends Schema>(schema: T): ((o: any) => o is Infer<T>) => f(schema) as any;
