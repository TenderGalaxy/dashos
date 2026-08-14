import { readdir, readFile } from 'node:fs/promises'
import { Worker } from 'node:worker_threads'

function run(wc: string, cb: string, test: string): Promise<string | boolean> {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./virtual/helper.ts', {
            workerData: { wc, cb, test },
        })
        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code: number) => {
            if (code !== 0) {
                reject(new Error(code.toString()))
            }
        })
    })
}

let files = await readdir('./virtual/tests', { recursive: true })
let wc = await readFile('./dist/wc.js', { encoding: 'utf8' })
let cb = await readFile('./dist/cb.js', { encoding: 'utf8' })
for (let i of files) {
    let j = './tests/' + i
    console.log(`Now testing ${i}`)

    let out = await run(wc, cb, j)
    if (out === true) {
        console.log('Test passed.')
    } else if (out === false) {
        console.log('Test failed.')
    } else {
        console.log(`Output: ${out}`)
    }
}
