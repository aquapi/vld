import type {
    ArraySchema, ConstSchema, EnumSchema, NumericSchema, BoolSchema,
    ObjectSchema, Schema, StringSchema, Value, NullSchema, FieldNotation
} from '../types';
import extend from './utils/extend';
import merge from './utils/merge';

export default {
    /**
     * Number types
     */
    num: extend({
        type: 'number'
    } as NumericSchema),

    /**
     * String type
     */
    str: extend({
        type: 'string'
    } as StringSchema),

    /**
     * Boolean type
     */
    bool: {
        type: 'boolean'
    } as BoolSchema,

    /**
     * Represent null
     */
    nil: {
        type: 'null'
    } as NullSchema,

    /**
     * Mark field as optional
     */
    opt: <T extends Schema>(t: T): T & FieldNotation<true> => {
        (t as T & FieldNotation<true>).optional = true;
        return t;
    },

    /**
     * Enum type
     */
    enum: (...values: Value[]): EnumSchema => ({ enum: values }),

    /**
     * Constant type
     */
    const: (value: Value): ConstSchema => ({ const: value }),

    /**
     * Array type
     */
    arr: <T extends Schema, O extends Omit<ArraySchema, 'type'> = {}>(schema: T, extend?: O): ArraySchema<T> & O => {
        const t: ArraySchema<T> = {
            type: 'array', items: schema
        };

        // @ts-ignore
        return extend ? merge(t, extend) : t;
    },

    /**
     * Tuple type
     */
    tuple: <T extends Schema[], O extends Omit<ArraySchema, 'type'>>(schemas: T, extend?: O): ArraySchema<true, T> & O => {
        const t: ArraySchema<true, T> = {
            type: 'array', prefixItems: schemas
        };

        // @ts-ignore
        return extend ? merge(t, extend) : t;
    },

    /**
     * Object type
     */
    obj: <T extends Record<string, Schema & FieldNotation>>(o: T): ObjectSchema<T> => {
        const t: ObjectSchema<{}, string[]> = {
            type: 'object',
            properties: {},
            required: []
        };

        let key: string;
        for (key in o) {
            t.properties[key] = o[key];

            if (!o[key].optional) t.required.push(key);
        }

        // @ts-ignore
        return t;
    }
}
