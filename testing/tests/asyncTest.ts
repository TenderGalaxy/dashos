//@ts-nocheck
export default async function test() {
    let out = await new Promise(function (resolve) {
        new Thread(
            (function* () {
                yield thl.sleep(20)
                return 45
            })(),
        ).then(function (z: number) {
            resolve(z)
        })
    })
    return out == 45
}
