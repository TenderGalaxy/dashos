import { readdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { floydSteinberg } from '../libdfc.ts'
import blocks from '../../textures/blocks.json' with { type: 'json' }
import blockIds from '../../textures/blockIds.json' with { type: 'json' }

const files = (await readdir('./ext/converters/images/in')).filter(
    (i) => !i.startsWith('.'),
)
for (let i of files) {
    let img = await sharp(`./ext/converters/images/in/${i}`)
        .flatten()
        .raw()
        .resize({
            width: 100,
            height: 50,
            fit: 'inside',
        })
    const pixels = await img.toBuffer({ resolveWithObject: true })

    let data = floydSteinberg(
        pixels.data,
        pixels.info.width,
        pixels.info.height,
        1,
    )
    sharp(Buffer.from(data.flatMap((i) => blocks[blockIds.indexOf(i)].color)), {
        raw: {
            width: pixels.info.width,
            height: pixels.info.height,
            channels: 3,
        },
    })
        .png()
        .toFile(`./ext/converters/images/out/${i}preview.png`)
    await writeFile(
        `./ext/converters/images/out/${i}.pic`,
        String.fromCodePoint(70 + pixels.info.height) +
            String.fromCodePoint(70 + pixels.info.width) +
            data.map((i) => String.fromCodePoint(70 + i)).join(''),
    )
}
