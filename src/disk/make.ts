import { readFile, readdir, writeFile } from 'node:fs/promises'
let out = `
new Thread(function*(){
`
for (let i of await readdir('./src/disk', {
    recursive: true,
})) {
    if (i.startsWith('.')) continue
    if (i.indexOf('/') == -1) continue
    if (i.indexOf('.') == -1) {
        out += `
        yield* fs.mkdir(${JSON.stringify(i)})
        `
    } else {
        let con = await readFile(`./src/disk/${i}`, { encoding: 'utf8' })
        out += `
        yield* fs.touch(${JSON.stringify(i)})
        yield* fs.writeFile(${JSON.stringify(i)}, ${JSON.stringify(con)})
        `
    }
}
out += '; yield* fs.touch("dashos/config")}())'
await writeFile('./dist/data.js', out)
