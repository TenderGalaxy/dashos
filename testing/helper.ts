import vm from "node:vm"
import { parentPort, workerData } from "node:worker_threads"
import { api } from "./api.ts"

let { wc, cb, test } = workerData
vm.runInThisContext(wc, { filename: "src/wc.ts" })
vm.runInThisContext(cb, { filename: "src/cb.ts" })
// @ts-expect-error
setInterval(tick, api.tickLength)

const f = (await import(test)).default
let out = await f(api.tickLength)
parentPort?.postMessage(out)
