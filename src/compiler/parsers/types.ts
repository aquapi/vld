export interface Macro {
    (literal: string): string;
}

export interface ParserResult {
    (o: any): boolean;
    macro: Macro;
};

export const macro = (f: Macro) => {
    const t = Function(`return o=>${f(o)}`)();
    t.macro = f;

    return t;
}
