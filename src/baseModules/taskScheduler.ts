import './callbackManager.ts'
import './time.ts'
interface tsPlan {
    schedule(delay: Number, func: Function, onError: Function): void
    scheduleFirstUnused(func: Function, onError: Function): Number
    parseAction(toRun: task): void
    makeAction(func: Function, onError: Function): task
}

type task = {
    func: Function
    onError: Function
}
export const ts: tsPlan = {
    makeAction(func, onError) {
        return { func, onError }
    },
    parseAction(toRun) {
        try {
            toRun.func()
        } catch {
            toRun.onError()
        }
    },
}
