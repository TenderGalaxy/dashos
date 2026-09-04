const fallChain = [
    './ext/textures/main-packs/default2/textures',
    './ext/textures/main-packs/default/textures',
]
import textures from './textures.json' with { type: 'json' }
import blockNames from './blockNames.json' with { type: 'json' }
import sharp from 'sharp'
import { join } from 'node:path'
import { writeFile } from 'node:fs/promises'
let out: Array<{
    color: [number, number, number]
    id: number
    variance: number
}> = []

let validBlockNames: number[] = []
let seenColors = new Map()
for (let i = 0; i < blockNames.length; i++) {
    const block = blockNames[i]
    if (block.indexOf('|') != -1) continue
    if (block.includes('Glass')) continue
    if (block.includes('Trapdoor')) continue
    if (block.includes('Slab')) continue
    await parse(block, out, i, validBlockNames)
}
async function parse(
    block: string,
    out: any[],
    id: number,
    validBlockNames: number[],
) {
    let texture = textures[block as keyof typeof textures]
    if (Array.isArray(texture)) {
        texture = (texture as Array<string>)[0]
    }
    for (let texturePack of fallChain) {
        try {
            let img = await sharp(join(texturePack, `${texture}.png`))
            const { data, info } = await img
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true })
            let pixels = []
            for (let i = 0; i < info.width * info.height; i++) {
                if (data[4 * i + 3] == 0) return
                pixels.push([data[4 * i], data[4 * i + 1], data[4 * i + 2]])
            }
            const average = Array.from({ length: 3 }, (_, i) => {
                let sum = 0
                for (let j of pixels) {
                    sum += j[i]
                }
                return Math.floor(sum / (info.width * info.height))
            })
            let variance = 0
            for (let i of pixels) {
                variance +=
                    i[0] + i[1] + i[2] - average[0] - average[1] - average[2]
            }
            if (seenColors.has(average)) return
            seenColors.set(average, 0)
            out.push({
                id,
                color: average,
                variance,
            })
            validBlockNames.push(id)
            return
        } catch {}
    }
}
writeFile('./ext/textures/blocks.json', JSON.stringify(out, null, 2))
writeFile(
    './ext/textures/blockIds.json',
    JSON.stringify(validBlockNames, null, 2),
)
