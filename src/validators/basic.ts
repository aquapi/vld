import { Validator } from './types';

/**
 * A string
 */
export const str: Validator<string> = {
    macro: str => `typeof ${str}==='string'`,
    f: o => typeof o === 'string'
};

/**
 * A number
 */
export const num: Validator<number> = {
    macro: str => `Number.isFinite(${str})`,
    f: Number.isFinite
}

/**
 * A number in a JSON string (which requires less parsing)
 */
export const fnum: Validator<number> = {
    macro: str => `typeof ${str}==='number'`,
    f: o => typeof o === 'number'
}

/**
 * A boolean
 */
export const bool: Validator<boolean> = {
    macro: str => `typeof ${str}==='boolean'`,
    f: o => typeof o === 'boolean'
}

/**
 * A numeric value
 */
export const numeric: Validator<number> = {
    macro: str => `Number.isFinite(${str})`,
    f: Number.isFinite,
    cast: {
        macro: str => `+${str}`,
        f: o => +o
    }
}

/**
 * An exact value
 */
export const val = <T>(v: T): Validator<T> => ({
    macro: str => `${str}===${JSON.stringify(v)}`,
    f: o => o === v
});
