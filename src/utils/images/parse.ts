import { readdir, readFile } from 'node:fs/promises'
import sharp from 'sharp'
import rgbToId from '../rgbToId.ts'
import blocks from '../../textures/blocks.json' with { type: 'json' }

const files = (await readdir('./src/utils/images/in')).filter(
    (i) => !i.startsWith('.'),
)
for (let i of files) {
    let img = await sharp(`./src/utils/images/in/${i}`)
        .flatten()
        .raw()
        .resize(128, 64)
    const pixels = await img.toBuffer({ resolveWithObject: true })

    const [r, g, b] = Array.from({ length: 3 }, (_, i) =>
        Array.from(
            { length: pixels.info.width * pixels.info.height },
            (_, j) => pixels.data[3 * j + i],
        ),
    )
    for (let i = 0; i < pixels.data.length; i += 3) {
        console.log(
            rgbToId([pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]])
                .name,
        )
    }
}
