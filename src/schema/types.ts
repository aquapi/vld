/**
 * Properties of object schema
 */
export interface ObjectProperties extends Record<string, Schema> { };

/**
 * Represent an object
 */
export interface ObjectSchema<Properties extends ObjectProperties = ObjectProperties> {
    type: 'object';

    properties: Properties;

    required?: string[];
}

/**
 * Represent an array
 */
export interface ArraySchema<
    Item extends Schema | boolean = Schema | boolean,
    PrefixItems extends Schema[] = Schema[]
> {
    type: 'array';

    items?: Item;
    prefixItems?: PrefixItems;

    minItems?: number;
    maxItems?: number;
}

/**
 * Represent a number
 */
export interface NumericSchema {
    type: 'number' | 'integer';

    multipleOf?: number;

    minimum?: number;
    exclusiveMinimum?: number;

    maximum?: number;
    exclusiveMaximum?: number;

    /**
     * Non-standard property. 
     * This tells the macro to use `typeof` instead of `Number.isFinite` to validate
     */
    nonFinite?: boolean;
}

/**
 * Represent a string
 */
export interface StringSchema {
    type: 'string';

    minLength?: number;
    maxLength?: number;

    pattern?: string;
}

/**
 * Represent an enum
 */
export interface EnumSchema<T extends Value[] = Value[]> {
    enum: T;
}

// Types with no additional properties
export interface BoolSchema {
    type: 'boolean';
}

export interface NullSchema {
    type: 'null';
}

/**
 * Represent a constant
 */
export interface ConstSchema<T extends Value = Value> {
    const: T;
}

/**
 * Basic stuff
 */
export type LogicSchema = {
    oneOf: Schema[];
} | {
    allOf: Schema[];
} | {
    anyOf: Schema[];
}

/**
 * Non-standard property for properies in object
 */
export interface FieldNotation {
    optional?: boolean;
}

/**
 * Schema type
 */
export type Schema = (
    ObjectSchema | ArraySchema | BoolSchema | NullSchema |
    NumericSchema | StringSchema | EnumSchema | ConstSchema | LogicSchema
);

/**
 * Represent a value
 */
export type Value = string | number | boolean | null;
