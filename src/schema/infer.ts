import type {
    BoolSchema, NumericSchema, ObjectSchema,
    StringSchema, NullSchema, EnumSchema, ConstSchema,
    OrSchema, AndSchema, ArraySchema
} from './types';

type And<A, B> = A & B;
type SpreadEnum<T> = T extends [infer Current, ...infer Rest] ? Current & SpreadEnum<Rest> : never;
type SpreadAnd<T> = T extends [infer Current, ...infer Rest] ? Infer<Current> & SpreadAnd<Rest> : never;
type SpreadOr<T> = T extends [infer Current, ...infer Rest] ? Infer<Current> | SpreadAnd<Rest> : never;
type InferEach<T> = T extends [infer Current, ...infer Rest] ? [Infer<Current>, ...InferEach<Rest>] : [];

/**
 * Infer type for a schema object
 */
export type Infer<T> = T extends NumericSchema ? number : (
    T extends StringSchema ? string : (
        T extends BoolSchema ? boolean : (
            T extends NullSchema ? null : (
                T extends EnumSchema<any> ? SpreadEnum<T['enum']> : (
                    T extends ConstSchema<any> ? T['const'] : (
                        T extends ObjectSchema<any, any> ? ObjectInfer<T> : (
                            T extends ArraySchema<any, any> ? ArrayInfer<T> : (
                                T extends AndSchema<any> ? SpreadAnd<T['allOf']> : (
                                    T extends OrSchema<any> ? SpreadOr<T['anyOf']> : never
                                )
                            )
                        )
                    )
                )
            )
        )
    )
);

export type RawObjectInfer<Properties extends object, Required extends string> = {
    [key in Exclude<keyof Properties, Required>]?: Infer<Properties[key]>;
} & { [key in And<keyof Properties, Required>]: Infer<Properties[key]>; };

export type ObjectInfer<T extends ObjectSchema> = RawObjectInfer<T['properties'], T['required'][number]>;

export type ArrayInfer<T extends ArraySchema> = [...InferEach<T['prefixItems']>, ...(Infer<T['items']>)[]];
