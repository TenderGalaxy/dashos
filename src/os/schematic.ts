import ids from '../../ext/converters/stableIds.json' with { type: 'json' }
export function readSchemLen(pos: [number, number, number]) {
    function read(idx: number) {
        return ids.indexOf(
            api.getBlockId(
                pos[0] + (idx >> 10),
                pos[1] + (Math.floor(idx / 32) % 32),
                pos[2] + (idx % 32),
            ),
        )
    }
    let idx = 0
    function next() {
        let val = 0
        let len = 0
        while (1) {
            let byte = read(idx++)
            val += (byte % 128) << (len * 7)
            if (byte >> 7 == 0) return val
            len++
        }
        return val
    }
    if (next() != 12483) throw new TypeError('Not a DashOS Chunk Record')
    let v = next()
    for (let i = 0; i < v; i++) next()
    return next() + v + 2
}
export function readSchematic(pos: [number, number, number]) {
    function read(idx: number) {
        return ids.indexOf(
            api.getBlockId(
                pos[0] + (idx >> 10),
                pos[1] + (Math.floor(idx / 32) % 32),
                pos[2] + (idx % 32),
            ),
        )
    }
    let idx = 0
    function next() {
        let val = 0
        let len = 0
        while (1) {
            let byte = read(idx++)
            val += (byte % 128) << (len * 7)
            if (byte >> 7 == 0) return val
            len++
        }
        return val
    }
    if (next() != 12483) throw new TypeError('Not a DashOS Chunk Record')
    let name = Array.from({ length: next() }, (_) =>
        String.fromCodePoint(next()),
    ).join('')
    let len = next()
    let contents = ''
    for (let i = 0; i < len; i++) {
        contents += String.fromCodePoint(next())
    }
    return { contents, name, idx }
}
export function writeSchematic(
    name: string,
    contents: string,
    pos: [number, number, number],
) {
    let idx = 0
    function write(val: number) {
        while (1) {
            api.setBlock(
                pos[0] + (idx >> 10),
                pos[1] + (Math.floor(idx / 32) % 32),
                pos[2] + (idx & 31),
                ids[(val > 127 ? 128 : 0) + (val % 128)].toString(),
            )
            val = Math.floor(val / 128)
            idx++
            if (val == 0) break
        }
    }
    write(12483)
    write(name.length)
    for (let i = 0; i < name.length; i++) {
        write(name.charCodeAt(i))
    }
    write(contents.length)
    for (let i = 0; i < contents.length; i++) {
        write(contents.charCodeAt(i))
    }
    return 32 * (idx >> 10) + 1
}
