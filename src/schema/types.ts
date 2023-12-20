/**
 * Properties of object schema
 */
export interface ObjectProperties extends Record<string, Schema> { };

/**
 * Represent an object
 */
export interface ObjectSchema extends BasicSchema {
    type: 'object';

    properties?: ObjectProperties;
    patternProperties?: ObjectProperties;

    additionalProperties?: boolean;

    minProperties?: number;
    maxProperties?: number;

    propertyNames?: StringSchema;
    required?: string[];
}

/**
 * Represent an array
 */
export interface ArraySchema extends BasicSchema {
    type: 'array';

    items?: Schema | boolean;
    prefixItems?: Schema[];
    unevaluatedItems?: Schema | boolean;
    contains?: Schema;

    minContains?: number;
    maxContains?: number;

    minItems?: number;
    maxItems?: number;

    uniqueItems?: boolean;
}

/**
 * Represent a number
 */
export interface NumericSchema extends BasicSchema {
    type: 'number' | 'integer';

    multipleOf?: number;

    minimum?: number;
    exclusiveMinimum?: number;

    maximum?: number;
    exclusiveMaximum?: number;
}

/**
 * Represent a string
 */
export interface StringSchema extends BasicSchema {
    type: 'string';

    minLength?: number;
    maxLength?: number;

    pattern?: string;
    format?: StringFormat;
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
export interface BasicSchema {
    oneOf?: Schema[];
    allOf?: Schema[];
    anyOf?: Schema[];
}

/**
 * All string format
 */
export type StringFormat =
    'date-time' | 'time' | 'date' | 'duration' |
    `${'' | 'idn-'}${'email' | 'hostname'}` |
    `ipv${4 | 6}` | 'uuid' | `iri${'' | '-reference'}` |
    `uri${'' | `-${'reference' | 'template'}`}`

/**
 * Schema type
 */
export type Schema = (
    ObjectSchema | ArraySchema | BoolSchema | NullSchema |
    NumericSchema | StringSchema | EnumSchema | ConstSchema
);

/**
 * Represent a value
 */
export type Value = string | number | boolean | null;
