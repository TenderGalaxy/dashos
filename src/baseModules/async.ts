import { ts } from './taskScheduler.js'

type Vow = (resolve: () => void) => void
type ThenFunction = (...args: any[]) => void
export class Thread {
    task
    mode = this.every(2)
    returnValue: any = undefined
    constructor(f: Generator<any, any, any>) {
        this.task = f
        this.mode()
    }
    every(delay: number) {
        return (res?: any) => {
            //@ts-expect-error
            ts.schedule(delay, () => this.step(res))
        }
    }
    step(res?: any) {
        let { value, done } = this.task.next(res)
        if (done) {
            this.runThens(value)
        } else if (this.isValidCode(value)) {
            this.processCode(value)
        } else {
            this.mode()
        }
    }
    #then: ThenFunction[] = []
    then(f: ThenFunction) {
        this.#then.push(f)
    }
    runThens(out: any) {
        for (let i of this.#then) {
            i(out)
        }
    }

    isValidCode(val: any): val is { async: any } {
        return typeof val === 'object' && Object.hasOwn(val, 'async')
    }
    processCode(val: { async: any }) {
        switch (val.async) {
            case 'await':
                //@ts-expect-error
                val.func((res?: any) => this.mode(res))
                break
            case 'halt':
                break
        }
    }
}
export const thl = {
    awaitPromise(f: Vow) {
        return { async: 'await', func: f }
    },
    awaitAll(l: Vow[]) {
        let out: any[] = []
        let num = l.length,
            satisfied = 0
        return this.awaitPromise((resolve: (res?: any) => void) => {
            for (let i of l) {
                i((res?: any) => {
                    satisfied++
                    out.push(res)
                    if (satisfied == num) {
                        resolve(out)
                    }
                })
            }
        })
    },
    /*
    awaitAll returns a Resolver function that calls every input Resolver and waits until they all finish.
    */
    awaitRace(l: Vow[]) {
        let resolved = false
        return this.awaitPromise((resolve: (res?: any) => void) => {
            for (let i of l) {
                i((res?: any) => {
                    if (!resolved) {
                        resolve(res)
                        resolved = true
                    }
                })
            }
        })
    },
    halt() {
        return { async: 'halt' }
    },
    sleep(delay: number) {
        return this.awaitPromise((resolve: () => void) =>
            //@ts-expect-error
            ts.schedule(delay, resolve),
        )
    },
    *waitUntil(condition: () => boolean) {
        while (!condition()) {
            yield
        }
    },
}
