import { EnumSchema, Value } from '../../schema/types';
import { ParserResult } from './types';

const toCaseStatement = (v: Value) => `case ${JSON.stringify(v)}:`

export default (schema: EnumSchema): ParserResult => Function(`return o=>{switch(o){${schema.enum.map(toCaseStatement)}return true;default:return false}}}`)();
