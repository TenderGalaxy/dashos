import { callbacks } from './callbackManager.ts'
import { time } from './time.ts'
import { catchError } from './errors.ts'
interface tsPlan {
    schedule(delay: number, func: Function, onError: Function): void
    scheduleFirstUnused(func: Function, onError: Function): number
    parseAction(toRun: task): void
    makeAction(func: Function, onError: Function): task
    tasks: Record<number, task[]>
}

type task = {
    func: Function
    onError: Function
}
export const ts: tsPlan = {
    tasks: {},
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
    for (let i of ts.tasks[time] || []) {
        ts.parseAction(i)
    }
    delete ts.tasks[time]
})
