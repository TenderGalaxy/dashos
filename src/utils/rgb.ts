import blocks from '../textures/blocks.json' with { type: 'json' }
function findDiff(a: [number, number, number], b: [number, number, number]) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
}
export function rgbToId(rgb: [number, number, number] | string) {
    if (typeof rgb == 'string') {
        return { id: rgb }
    }
    let out = {
        loss: Number.MAX_VALUE,
        id: '',
        rLoss: [0, 0, 0],
    }
    for (let i = 0; i < blocks.length; i++) {
        let loss = findDiff(rgb, blocks[i].color as [number, number, number])
        if (loss < out.loss) {
            out.loss = loss
            out.id = blocks[i].id
            out.rLoss = [
                rgb[0] - blocks[i].color[0],
                rgb[1] - blocks[i].color[1],
                rgb[2] - blocks[i].color[2],
            ]
        }
    }
    return out
}
