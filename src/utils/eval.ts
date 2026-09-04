import * as evals from './eval.ts'
export function contextualEval(ctx: Record<any, any>, code: string): any {
    return evals.contextualEval(ctx, code)
}
export function evaluate(code: string): any {
    return evals.evaluate(code)
}
