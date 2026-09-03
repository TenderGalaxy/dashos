//@ts-expect-error
import evals from './eval.js'
export function contextualEval(ctx: Record<any, any>, code: string) {
    return evals.contextualEval(ctx, code)
}
export function evaluate(code: string) {
    return evals.evaluate(code)
}
