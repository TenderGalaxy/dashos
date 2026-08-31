export default contextualEval = new Function(
    'ctx',
    'script',
    'with (ctx) { return eval(script); }',
)
