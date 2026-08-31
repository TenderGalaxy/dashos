import { readdir, writeFile } from 'node:fs/promises'
import { parseSchem } from '../libdfc.ts'
const files = (await readdir('./ext/converters/bloxschem/out')).filter(
    (i) => !i.startsWith('.'),
)
for (const file of files) {
    const { contents, name, idx } = await parseSchem(
        `./ext/converters/bloxschem/out/${file}`,
    )
    await writeFile(`./ext/converters/bloxschem/in/${name}`, contents)
}
