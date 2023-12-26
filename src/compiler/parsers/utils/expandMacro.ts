import { ParserResult } from '../types';
import SymbolSet from './symbols';

export default (parsed: ParserResult, symbols: SymbolSet, value: string, wrapMacro: boolean = false) =>
    parsed.macro ? (wrapMacro ? `(${parsed.macro(value)})` : parsed.macro(value)) : symbols.put(parsed) + `(${value})`;
