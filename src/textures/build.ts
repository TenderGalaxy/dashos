import data from '../../ext/textures/blocks.json' with { type: 'json' }
import { writeFile } from 'node:fs/promises'
let out = []
let used = new Uint8Array(256 * 256 * 256).fill(0)
const compAmt = 16
for (let i of data) {
    if (used[(i.color[0] << 16) + (i.color[1] << 8) + i.color[2]] == 1) continue
    for (let j = -compAmt; j < compAmt; j++) {
        for (let k = -compAmt; k < compAmt; k++) {
            for (let z = -compAmt; z < compAmt; z++) {
                let v = [i.color[0] + j, i.color[1] + k, i.color[2] + z]
                if (v.every((i) => 0 < i && i < 256)) {
                    used[(v[0] << 16) + (v[1] << 8) + v[2]] = 1
                }
            }
        }
    }
    out.push({
        color: i.color,
        variance: i.variance,
        id: i.id.toString(),
    })
}
console.log(out.length)
writeFile('./src/textures/blocks.json', JSON.stringify(out, null, 2))
