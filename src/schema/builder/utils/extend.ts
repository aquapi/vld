import { Schema } from '../../types';
import clone from './clone';
import merge from './merge';

export default <T extends Schema>(schema: Omit<T, 'type'>) => merge(
    (t: T) => clone(schema as T, t), schema
);
