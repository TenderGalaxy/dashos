//@ts-nocheck
export default async function test() {
    let out = await new Promise(function (resolve) {
        new Thread(
            (function* () {
                yield thl.sleep(20)
                let a = yield thl.awaitAll([
                    (resolve) => ts.schedule(20, () => resolve(45)),
                    (resolve) => ts.schedule(10, () => resolve()),
                ])
                return a
            })(),
        ).then(function (z: number) {
            resolve(z)
        })
    })
    return out == 45
}
