import { callbacks } from './callbackManager.js'
import { time } from './time.js'
import { catchError } from './errors.js'
interface tsPlan {
    schedule(delay: number, func: Function, onError: Function): void
    scheduleFirstUnused(func: Function, onError: Function): number
    parseAction(toRun: task): void
    makeAction(func: Function, onError: Function): task
    tasks: Record<number, task[]>
    stack: task[]
}

type task = {
    func: Function
    onError: Function
}
export const ts: tsPlan = {
    tasks: {},
    stack: [],
    makeAction(func, onError) {
        return { func, onError }
    },
    parseAction(toRun) {
        try {
            toRun.func()
        } catch (e) {
            toRun.onError(e)
        }
    },
    schedule(delay, func, onError = catchError) {
        if (ts.tasks?.[time + delay]) {
            ts.tasks[time + delay]!.push(ts.makeAction(func, onError))
        } else {
            ts.tasks[time + delay] = [ts.makeAction(func, onError)]
        }
    },
    scheduleFirstUnused(func, onError = catchError) {
        let t = 0
        while (ts.tasks?.[time + t]) {
            t++
        }
        ts.schedule(t, func, onError)
        return t
    },
}
callbacks!.tick!.push(function () {
    ts.stack.push(...(ts.tasks[time] || []))
    delete ts.tasks[time]
    for (let i of ts.stack) {
        ts.parseAction(i)
        if (api.isNearInterrupt()) {
            return
        }
    }
})
