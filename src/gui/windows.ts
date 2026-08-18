import { windows, type Window } from './windowManager.ts'
import { display } from './screen.ts'
import font from '../utils/font/font.json' with { type: 'json' }

export class BasicWindow implements Window {
    pos
    x
    y
    data: Array<Array<number | string>>
    id: string
    man
    constructor(
        x: number,
        y: number,
        pos: [number, number],
        man: typeof windows,
    ) {
        this.pos = pos
        this.x = x
        this.y = y
        this.data = Array.from({ length: y }, (_) =>
            Array(x).fill(display.white),
        )
        this.id = Math.random().toString(36).slice(2)
        this.man = man
        this.man.add(this, this.id)
    }
    fillBorder(color: number | string) {
        for (let i = 0; i < this.x; i++) {
            this.data[0][i] = color
            this.data[this.y - 1][i] = color
        }
        for (let i = 0; i < this.y; i++) {
            this.data[i][0] = color
            this.data[i][this.x - 1] = color
        }
    }
    click(a: [number, number]) {}
    fill(color: number | string) {
        for (let i = 0; i < this.y; i++) {
            for (let j = 0; j < this.x; j++) {
                this.data[i][j] = color
            }
        }
    }
    bringToFront() {
        this.man.bringToFront(this.id)
    }
    sendToBack() {
        this.man.sendToBack(this.id)
    }
    render() {
        for (let i = 0; i < this.y; i++) {
            for (let j = 0; j < this.x; j++) {
                if (
                    this.pos[0] + i < display.y &&
                    this.pos[1] + j < display.x
                ) {
                    display.pixels[this.pos[0] + i][this.pos[1] + j] =
                        this.data[i][j]
                }
            }
        }
    }
}
