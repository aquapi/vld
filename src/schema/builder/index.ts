import type {
    ArraySchema, ConstSchema, EnumSchema, NumericSchema, BoolSchema,
    ObjectSchema, Schema, StringSchema, Value, NullSchema, FieldNotation
} from '../types';
import extend from './utils/extend';
import merge from './utils/merge';

export default {
    /**
     * Number type
     */
    num: extend({
        type: 'number',
        nonFinite: true
    } as NumericSchema),

    /**
     * Finite number types
     */
    snum: extend({
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
    obj: <T extends { [key: string]: Schema & FieldNotation<boolean> }>(o: T): ObjectSchema<
        T, StringList<
            RemoveOptional<
                StringList<
                    UnionToTuple<Extract<keyof T, string>>
                >, T
            >
        >
    > => {
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

type UnionToIntersection<U> = (
    U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
    ? I
    : never;

type UnionToTuple<T extends string> = UnionToIntersection<
    T extends never ? never : (t: T) => T
> extends (_: never) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];

type StringList<Original> = Original extends string[] ? Original : [];

// Remove optional keys
type RemoveOptional<
    T extends string[],
    O extends Record<string, Schema & FieldNotation<boolean>>
> = T extends [infer Current, ...infer Rest] ? (
    // Current key 
    Current extends keyof O ? (
        O[Current]['optional'] extends true
        ? RemoveOptional<StringList<Rest>, O>
        : [Current, ...RemoveOptional<StringList<Rest>, O>]
    ) : []
) : []
