export class Screen {
    x = 128
    y = 64
    pos = [0, 0, 50]
    up = 1
    right = 0
    screen: number[][]
    white = 144
    black = 86
    constructor(x = 128, y = 64, pos = [0, 0, 50], up = 1, right = 0) {
        this.x = x
        this.y = y
        this.pos = pos
        this.screen = Array.from({ length: y }, (_, i) =>
            Array(x).fill(this.white),
        )
        this.up = up
        this.right = right
    }
    render() {
        let p = [0, 0, 0]
        for (; p[this.up] < this.y; p[this.up]++) {
            for (p[this.right] = 0; p[this.right] < this.x; p[this.right]++) {
                api.setBlock(
                    [
                        this.pos[0] + p[0],
                        this.pos[1] + p[1],
                        this.pos[2] + p[2],
                    ],
                    this.screen[this.up][this.right].toString(),
                )
            }
        }
    }
}
