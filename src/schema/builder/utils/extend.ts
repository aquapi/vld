import { Schema } from '../../types';
import clone from './clone';
import merge from './merge';

export default <T extends Schema>(schema: T) => merge(
    (t: T) => clone(schema as Omit<T, 'type'>, t), schema
);
