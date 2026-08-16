//@ts-nocheck
export default async function test() {
    let out = await new Promise(function (resolve) {
        new Thread(
            (function* () {
                yield thl.sleep(10)
                let a = yield thl.awaitAll([
                    (resolve) => ts.schedule(10, () => resolve(45)),
                    (resolve) => ts.schedule(5, () => resolve(10)),
                ])
                return a
            })(),
        ).then(function (z: number) {
            resolve(z)
        })
    })
    return out[0] == 10 && out[1] == 45
}
