//@ts-nocheck

export default async function test() {
    let thread = new Thread(
        (function* () {
            yield* fs.createNewVolume('sys')
            yield* fs.createNewFile('sys', 'data.txt')
            yield* fs.setFile('sys/data.txt', 'testing')
            let out = yield* fs.getFile('sys/data.txt')
            return out == 'testing'
        })(),
    )
    return new Promise((res) => thread.then(res))
}
