export class Display {
    x = 128
    y = 64
    pos = [0, 0, 50]
    pixels: Array<Array<number | string>>
    white = 144
    black = 86
    constructor(x = 128, y = 64, pos = [0, 0, 50]) {
        this.x = x
        this.y = y
        this.pos = pos
        this.pixels = Array.from({ length: y }, (_, i) =>
            Array(x).fill(this.white),
        )
    }
    render() {
        let hx = this.x >> 1

        for (let i = 0; i < this.y; i++) {
            for (let j = 0; j < this.x; j++) {
                api.setBlock(
                    [
                        this.pos[0] + j - hx,
                        this.pos[1] + this.y - i + 1,
                        this.pos[2],
                    ],
                    this.pixels[i][j].toString(),
                )
            }
        }
    }
    setPixel(y: number, x: number, v: number | string) {
        if (0 <= y && y < this.y && 0 <= x && x < this.x) {
            this.pixels[y][x] = v
        }
    }
}
export const display = new Display()
