import vm from 'node:vm'
import { parentPort, workerData } from 'node:worker_threads'
import { api } from './api.js'

let { wc, cb, test } = workerData

vm.runInThisContext(wc)
vm.runInThisContext(cb)

//@ts-expect-error
setInterval(tick, api.tickLength)

const f = (await import(test)).default
let out = await f(api.tickLength)
parentPort?.postMessage(out)
