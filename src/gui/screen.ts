export class Display {
    x
    y
    pos
    pixels
    modified
    white = '144'
    black = '86'
    constructor(x = 128, y = 64, pos = [0, 0, 50]) {
        this.x = x
        this.y = y
        this.pos = pos
        this.pixels = Array(y * x).fill(this.white)
        this.modified = new Uint8Array(y * x).fill(1)
        this.render()
    }
    render(minx = 0, miny = 0, maxx = this.x, maxy = this.y) {
        let hx = this.x >> 1

        for (let i = miny; i < maxy; i++) {
            for (let j = minx; j < maxx; j++) {
                if (this.modified[this.x * i + j] == 1) {
                    this.modified[this.x * i + j] = 0
                    api.setBlock(
                        [
                            this.pos[0] + j - hx,
                            this.pos[1] + this.y - i + 1,
                            this.pos[2],
                        ],
                        this.pixels[this.x * i + j],
                    )
                }
            }
        }
    }
    setPixel(y: number, x: number, v: string) {
        if (
            0 <= y &&
            y < this.y &&
            0 <= x &&
            x < this.x &&
            this.pixels[this.x * y + x] != v
        ) {
            this.pixels[this.x * y + x] = v
            this.modified[this.x * y + x] = 1
        }
    }
    fill(color = display.white) {
        for (let i = 0; i < this.x * this.y; i++) {
            if (this.pixels[i] == color) {
                this.modified[i] = 0
            } else {
                this.modified[i] = 1
                this.pixels[i] = color
            }
        }
    }
}
export const display = new Display()
