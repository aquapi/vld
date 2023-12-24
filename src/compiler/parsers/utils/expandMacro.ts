import { ParserResult } from '../types';
import SymbolSet from './symbols';

export default (parsed: ParserResult, symbols: SymbolSet, value: string) =>
    parsed.macro ? parsed.macro(value) : symbols.put(parsed) + `(${value})`;
