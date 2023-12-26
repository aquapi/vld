import { EnumSchema, Value } from '../../schema/types';
import { ParserResult, macro } from './types';

const toCaseStatement = (v: Value) => `case ${JSON.stringify(v)}:`

export default (schema: EnumSchema): ParserResult => Function(`return o=>{switch(o){${schema.enum.map(toCaseStatement).join('')}return true;default:return false}}`)();
