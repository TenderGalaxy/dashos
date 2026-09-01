import rgbToId from '../rgbToId.ts'
import ids from './stableIds.json' with { type: 'json' }
export function floydSteinberg(
    arr: number[] | Buffer<ArrayBuffer>,
    w: number,
    h: number,
    extent = 0,
) {
    let out = new Array(w * h)

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let idx = y * w + x
            let arrIdx = idx * 3
            let v = rgbToId([arr[arrIdx], arr[arrIdx + 1], arr[arrIdx + 2]])
            out[idx] = v.id
            sendError(arr, x + 1, y, w, h, v.rLoss, (7 / 16) * extent)
            sendError(arr, x - 1, y + 1, w, h, v.rLoss, (3 / 16) * extent)
            sendError(arr, x, y + 1, w, h, v.rLoss, (5 / 16) * extent)
            sendError(arr, x + 1, y + 1, w, h, v.rLoss, (1 / 16) * extent)
        }
    }
    return out
}
function sendError(
    arr: number[] | Buffer<ArrayBuffer>,
    x: number,
    y: number,
    w: number,
    h: number,
    err: number[],
    coef: number,
) {
    if (x >= w || x < 0 || y >= h || y < 0) return
    arr[(y * w + x) * 3 + 0] = Math.max(
        Math.min(arr[(y * w + x) * 3 + 0] + err[0] * coef, 255),
        0,
    )
    arr[(y * w + x) * 3 + 1] = Math.max(
        Math.min(arr[(y * w + x) * 3 + 1] + err[1] * coef, 255),
        0,
    )
    arr[(y * w + x) * 3 + 2] = Math.max(
        Math.min(arr[(y * w + x) * 3 + 2] + err[2] * coef, 255),
        0,
    )
}

import pkg from 'avsc'
const { Type } = pkg
import { readFile } from 'node:fs/promises'

const encodeSchema = Type.forSchema({
    type: 'record',
    name: 'Schematic',
    fields: [
        {
            name: 'headers',
            type: { name: 'headers', type: 'fixed', size: 4 },
            default: '\u{4}\u{0}\u{0}\u{0}',
        },
        { name: 'name', type: 'string' },
        { name: 'x', type: 'int' },
        { name: 'y', type: 'int' },
        { name: 'z', type: 'int' },
        { name: 'width', type: 'int' },
        { name: 'height', type: 'int' },
        { name: 'length', type: 'int' },
        {
            name: 'chunks',
            type: {
                type: 'array',
                items: {
                    type: 'record',
                    name: 'chunk',
                    fields: [
                        { name: 'x', type: 'int' },
                        { name: 'y', type: 'int' },
                        { name: 'z', type: 'int' },
                        { name: 'blocks', type: 'bytes' },
                    ],
                },
            },
        },
        {
            name: 'blockdatas',
            type: {
                type: 'array',
                items: {
                    type: 'record',
                    name: 'blockdata',
                    fields: [
                        { name: 'blockX', type: 'int' },
                        { name: 'blockY', type: 'int' },
                        { name: 'blockZ', type: 'int' },
                        { name: 'blockdataStr', type: 'string' },
                    ],
                },
            },
            default: [],
        },
        { name: 'globalX', type: 'int', default: 0 },
        { name: 'globalY', type: 'int', default: 0 },
        { name: 'globalZ', type: 'int', default: 0 },
        {
            name: 'worldcode',
            type: [
                'null',
                {
                    type: 'record',
                    name: 'worldcode',
                    fields: [
                        { name: 'code', type: 'string', default: '' },
                        { name: 'dbId', type: 'string', default: '' },
                        { name: 'someint', type: 'int', default: 0 },
                        { name: 'someotherint', type: 'int', default: 0 },
                    ],
                },
            ],
            default: null,
        },
        { name: 'somebool', type: 'boolean', default: false },
    ],
})
const decodeSchema = Type.forSchema({
    type: 'record',
    name: 'Schematic',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'x', type: 'int' },
        { name: 'y', type: 'int' },
        { name: 'z', type: 'int' },
        { name: 'width', type: 'int' },
        { name: 'height', type: 'int' },
        { name: 'length', type: 'int' },
        {
            name: 'chunks',
            type: {
                type: 'array',
                items: {
                    type: 'record',
                    name: 'chunk',
                    fields: [
                        { name: 'x', type: 'int' },
                        { name: 'y', type: 'int' },
                        { name: 'z', type: 'int' },
                        { name: 'blocks', type: 'bytes' },
                    ],
                },
            },
        },
    ],
})
const res = decodeSchema.createResolver(encodeSchema)

// the chunk data is an RLE

// Char (0b01100101)
// Encoded Data: (0b10000001 0b0110010)
function read(ch: Buffer | number[], idx: { at: number }) {
    let val = 0
    let len = 0
    while (1) {
        let byte = ch[idx.at++] & 0xff
        val += (byte & 0x7f) << (len * 7)
        if (byte >> 7 == 0) return val
        len++
    }
    return val
}
function write(ch: number[], val: number) {
    while (1) {
        ch.push((val >> 7 == 0 ? 0 : 128) + (val & 0x7f))
        val >>= 7
        if (val == 0) break
    }
}
function parseChunk(ch: Buffer) {
    let idx = { at: 0 }
    let out = Array(32 ** 3)
    let outIdx = 0
    while (idx.at < ch.length) {
        let run = read(ch, idx),
            id = ids.indexOf(read(ch, idx))
        for (let i = 0; i < run; i++) {
            out[outIdx++] = id
        }
    }
    return out
}
export async function parseSchem(file: string) {
    const data = decodeSchema.fromBuffer(await readFile(file), res, true)
    const info = data.chunks.map((i: any) => parseChunk(i.blocks)).flat()

    let idx = { at: 0 }
    if (read(info, idx) != 12483)
        throw new TypeError(
            `Not a DashOS Chunk Record (vId: ${read(info, { at: 0 })}, expected: 12483)`,
        )
    let name = Array.from({ length: read(info, idx) }, (_) =>
        String.fromCodePoint(read(info, idx)),
    ).join('')
    let len = read(info, idx)
    let contents = ''
    for (let i = 0; i < len; i++) {
        contents += String.fromCodePoint(read(info, idx))
    }
    return { contents, name, idx }
}
export function makeSchem(name: string, contents: string) {
    let unencodedFile: number[] = []
    write(unencodedFile, 12483)
    write(unencodedFile, name.length)
    for (let i of name) {
        write(unencodedFile, i.charCodeAt(0))
    }
    write(unencodedFile, contents.length)
    for (let i of contents) {
        write(unencodedFile, i.charCodeAt(0))
    }

    let schematic = {
        name,
        x: 0,
        y: 0,
        z: 0,
        width: 32,
        height: 0,
        length: 32,
        chunks: Array<{ x: number; y: number; z: number; blocks: Buffer }>(),
    }
    while ((unencodedFile.length & 32767) != 0) {
        unencodedFile.push(0)
    }
    for (let i = 0, j = 0; i < unencodedFile.length; i += 32768, j += 32) {
        let encodedFile: number[] = []
        for (let k of unencodedFile.slice(i, i + 32768)) {
            write(encodedFile, 1)
            write(encodedFile, ids[k])
        }
        schematic.chunks.push({
            blocks: Buffer.from(encodedFile),
            x: 0,
            y: j,
            z: 0,
        })
        schematic.height = j + 32
    }
    return encodeSchema.toBuffer(schematic)
}
