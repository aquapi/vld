import { ParserResult } from "../types";

export default class SymbolSet<T = any> {
    names: string[] = [];
    values: T[] = [];
    prefix = 'f';

    /**
     * Put and return the key associated with the item
     */
    put = (value: T) => {
        const name = this.prefix + this.names.length;

        this.names.push(name);
        this.values.push(value);

        return name;
    }

    /**
     * Create a function with all the dependencies injected 
     */
    inject = (fn: string): ParserResult => Function(...this.names, fn)(...this.values);
}
