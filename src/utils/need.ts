import { fs } from '../boot/fs.ts'
import { parseFile } from './runFile.ts'

export default function* need(path: string) {
    let file = fs.joinPath('dashos', 'libraries', path + '.js')
    return parseFile(yield* fs.readFile(file))
}
