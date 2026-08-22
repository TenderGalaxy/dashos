import blocks from '../textures/blocks.json' with { type: 'json' }
function findDiff(a: [number, number, number], b: [number, number, number]) {
    return Math.abs(a[0] + a[1] + a[2] - b[0] - b[1] - b[2])
}
export default function rgbToId(rgb: [number, number, number]) {
    let minLoss = Number.MAX_VALUE
    let minVal = 0
    let minName = ''
    for (let i = 0; i < blocks.length; i++) {
        let loss = findDiff(rgb, blocks[i][1][1] as [number, number, number])
        if (loss < minLoss) {
            minLoss = loss
            minVal = i
            minName = blocks[i][0] as string
        }
    }
    return {
        loss: minLoss,
        val: minVal,
        name: minName,
    }
}
