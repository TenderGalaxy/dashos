import { createTextViewer } from '../os/inputWindows.ts'
import { contextualEval } from './eval.ts'
import { fs } from '../boot/fs.ts'

export function* viewFile(path: string) {
    let ctx = {
        view: function* (path: string, contents: string) {
            return createTextViewer(path, contents, 54, 118, [5, 5])
        },
    }
    let extension = path.split('.').at(-1)
    if (yield* fs.isFile(`dashos/formats/${extension}.js`)) {
        contextualEval(
            ctx,
            yield* fs.readFile(`dashos/formats/${extension}.js`),
        )
    }
    yield* ctx.view(path, yield* fs.readFile(path))
}

export function* parseFile(path: string) {
    let ctx = {
        parse: function* (path: string, contents: string) {
            return contents
        },
    }
    let extension = path.split('.').at(-1)
    if (yield* fs.isFile(`dashos/formats/${extension}.js`)) {
        contextualEval(
            ctx,
            yield* fs.readFile(`dashos/formats/${extension}.js`),
        )
    }
    yield* ctx.parse(path, yield* fs.readFile(path))
}
