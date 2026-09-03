export const contextualEval = new Function(
    'ctx',
    'script',
    'with (ctx) { return eval(script); }',
)

export const evaluate = new Function('text', 'return eval(text)')
