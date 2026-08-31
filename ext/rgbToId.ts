import blocks from './textures/blocks.json' with { type: 'json' }
function findDiff(a: [number, number, number], b: [number, number, number]) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
}
export default function rgbToId(rgb: [number, number, number]) {
    let out = {
        loss: Number.MAX_VALUE,
        val: 0,
        name: '',
        rLoss: [0, 0, 0],
    }
    for (let i = 0; i < blocks.length; i++) {
        let loss = findDiff(rgb, blocks[i][1][1] as [number, number, number])
        if (loss < out.loss) {
            out.loss = loss
            out.val = i
            out.name = blocks[i][0] as string
            out.rLoss = [
                //@ts-expect-error
                rgb[0] - blocks[i][1][1][0],
                //@ts-expect-error
                rgb[1] - blocks[i][1][1][1],
                //@ts-expect-error
                rgb[2] - blocks[i][1][1][2],
            ]
        }
    }
    console.log(out)
    return out
}
/*
  [
    "Blue Planks",
    [
      136,
      [
        60,
        64,
        145
      ]
    ]
  ],
*/
