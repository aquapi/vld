/**
 * Properties of object schema
 */
export interface ObjectProperties extends Record<string, Schema> { };

/**
 * Represent an object
 */
export interface ObjectSchema<
    Properties extends ObjectProperties = ObjectProperties,
    Required extends string[] = []
> {
    type: 'object';

    properties: Properties;

    required?: Required;
}

/**
 * Represent an array
 */
export interface ArraySchema<
    Item extends Schema | boolean = Schema | boolean,
    PrefixItems extends Schema[] = []
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
 * AND logic schema
 */
export interface AndSchema<T extends Schema[] = []> {
    allOf: T;
}

/**
 * OR logic schema
 */
export interface OrSchema<T extends Schema[] = []> {
    anyOf: T;
}

/**
 * Non-standard property for properies in object
 */
export interface FieldNotation<Optional extends boolean = false> {
    optional?: Optional;
}

/**
 * Schema type
 */
export type Schema = (
    ObjectSchema | ArraySchema | BoolSchema | NullSchema |
    NumericSchema | StringSchema | EnumSchema | ConstSchema |
    AndSchema | OrSchema
);

/**
 * Represent a value
 */
export type Value = string | number | boolean | null;
