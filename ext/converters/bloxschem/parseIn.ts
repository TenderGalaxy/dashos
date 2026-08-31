import { readdir, readFile, writeFile } from 'node:fs/promises'
import { makeSchem } from '../libdfc.ts'
const files = (await readdir('./ext/converters/bloxschem/in')).filter(
    (i) => !i.startsWith('.'),
)
for (const file of files) {
    await writeFile(
        `./ext/converters/bloxschem/out/${file}.bloxdschem`,

        await makeSchem(
            file,
            await readFile(`./ext/converters/bloxschem/in/${file}`, {
                encoding: 'utf8',
            }),
        ),
    )
}
