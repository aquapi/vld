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
                T extends EnumSchema ? SpreadEnum<T['enum']> : (
                    T extends ConstSchema ? T['const'] : (
                        T extends ObjectSchema ? ObjectInfer<T> : (
                            T extends ArraySchema ? ArrayInfer<T> : (
                                T extends AndSchema ? SpreadAnd<T['allOf']> : (
                                    T extends OrSchema ? SpreadOr<T['anyOf']> : never
                                )
                            )
                        )
                    )
                )
            )
        )
    )
);

// Infer idividual types
export type ObjectInfer<T extends ObjectSchema> = {
    [key in Exclude<keyof T['properties'], T['required'][number]>]?: Infer<T['properties'][key]>;
} & { [key in And<keyof T['properties'], T['required'][number]>]: Infer<T['properties'][key]>; };

export type ArrayInfer<T extends ArraySchema> = [...InferEach<T['prefixItems']>, ...(Infer<T['items']>)[]];
