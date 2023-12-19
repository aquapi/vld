/**
 * A macro function
 */
export interface Macro {
    (literal: string): string;
}

/**
 * Validator cast
 */
export interface ValidatorCast<T = any> {
    /**
     * Macro to inline
     */
    macro?: Macro;

    /**
     * Cast to type T
     */
    f(o: any): T;
}

/**
 * Represents a validator
 */
export interface Validator<T = any> {
    /**
     * Macro to inline
     */
    macro?: Macro,

    /**
     * Validation function
     */
    f(o: any): boolean;

    /**
     * Casting
     */
    cast?: ValidatorCast<T>;
}

/**
 * Infer validator type
 */
export type Infer<T> = T extends Validator<infer R> ? R : any;
