const fallChain = [
    './src/textures/main-packs/default2/textures',
    './src/textures/main-packs/default/textures',
]
import textures from './textures.json' with { type: 'json' }
import blockNames from './blockNames.json' with { type: 'json' }
import sharp from 'sharp'
import { join } from 'node:path'
import { writeFile } from 'node:fs/promises'
let out = []
for (let block of blockNames) {
    let texture = textures[block as keyof typeof textures]
    if (Array.isArray(texture)) {
        texture = (texture as Array<any>)[0]
        if (typeof texture == 'number') {
            continue
        }
        out.push([block, [Number.MAX_VALUE, [255, 255, 255]]])
    } else if (typeof texture == 'object') {
        out.push([block, [Number.MAX_VALUE, [255, 255, 255]]])
        continue
    }
    let flag = false
    for (let texturePack of fallChain) {
        let img
        try {
            img = await sharp(join(texturePack, `${texture}.png`))
            const { data, info } = await img
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true })
            const pix = Array.from(
                { length: info.width * info.height },
                (_, i) => {
                    if (data[4 * i + 3] == 0) {
                        return [255, 255, 255]
                    } else {
                        return [data[4 * i], data[4 * i + 1], data[4 * i + 2]]
                    }
                },
            )

            const average = Array.from({ length: 3 }, (_, i) => {
                let sum = 0
                for (let j of pix) {
                    sum += j[i]
                }
                return Math.floor(sum / (info.width * info.height))
            })
            let variance = 0
            for (let i of pix) {
                variance +=
                    i[0] + i[1] + i[2] - average[0] - average[1] - average[2]
            }
            flag = true
            out.push([block, [variance, average]])
            break
        } catch {}
    }
    if (!flag) {
        out.push([block, [0, [255, 255, 255]]])
    }
}
writeFile('./src/textures/blocks.json', JSON.stringify(out, null, 2))
