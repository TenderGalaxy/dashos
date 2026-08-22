import { readdir, readFile } from 'node:fs/promises'
import sharp from 'sharp'
import rgbToId from '../rgbToId.js'

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
    console.log(r, g, b)
}
