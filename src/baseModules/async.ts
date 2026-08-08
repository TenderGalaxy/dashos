import { ts } from './taskScheduler.ts'
export class Thread {
    task
    mode = this.every(2)
    returnValue: any = undefined
    constructor(f: Generator<any, any, any>) {
        this.task = f
        this.mode()
    }
    every(delay: number) {
        return function () {
            //@ts-expect-error
            ts.schedule(delay, () => this.step())
        }
    }
    step() {
        let { value, done } = this.task.next()
        if (done) {
            this.runThens(value)
        } else if (this.isValidCode(value)) {
            this.processCode(value)
        } else {
            this.mode()
        }
    }
    #then: Function[] = []
    then(f: Function) {
        this.#then.push(f)
    }
    runThens(...args: any[]) {
        for (let i of this.#then) {
            i(...args)
        }
    }

    isValidCode(val: any): val is { async: any } {
        return typeof val === 'object' && Object.hasOwn(val, 'async')
    }
    processCode(val: { async: any }) {
        switch (val.async) {
            case 'await':
                //@ts-expect-error
                val.func(() => this.mode())
                break
            case 'halt':
                break
        }
    }
}
export const thl = {
    awaitPromise(f: Function) {
        return { async: 'await', func: f }
    },
    halt() {
        return { async: 'halt' }
    },
    sleep(delay: number) {
        return this.awaitPromise((resolve: Function) =>
            //@ts-expect-error
            ts.schedule(delay, resolve),
        )
    },
    *waitUntil(condition: Function) {
        while (!condition()) {
            yield
        }
    },
}
