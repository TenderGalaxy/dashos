import { windows, type Window } from './windowManager.ts'
import { display } from './screen.ts'
import font from '../font/fonts/default.json' with { type: 'json' }
import meta from '../font/fonts/defaultMeta.json' with { type: 'json' }
import { rgbToId } from '../utils/rgb.ts'

type pixel = [number, number, number] | string
export class BasicWindow implements Window {
    pos
    x
    y
    data: Array<Array<pixel>>
    id: string
    man
    constructor(
        y: number,
        x: number,
        pos: [number, number],
        man: typeof windows = windows,
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
    fillBorder(color: pixel) {
        for (let i = 0; i < this.x; i++) {
            this.data[0][i] = color
            this.data[this.y - 1][i] = color
        }
        for (let i = 0; i < this.y; i++) {
            this.data[i][0] = color
            this.data[i][this.x - 1] = color
        }
    }
    click(a: [number, number]) {
        let rcpos = [a[0] - this.pos[0], a[1] - this.pos[1]]
        if (
            rcpos[0] < 0 ||
            rcpos[0] > this.y ||
            rcpos[1] < 0 ||
            rcpos[1] > this.x
        )
            return false
        this.onClick([a[0] - this.pos[0], a[1] - this.pos[1]])
        return true
    }
    onClick = function (cursorPos: [number, number]) {}
    fill(color: pixel) {
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
    hide() {
        this.man.hideWindow(this.id)
    }
    render() {
        for (let i = 0; i < this.y; i++) {
            for (let j = 0; j < this.x; j++) {
                let pix =
                    typeof this.data[i][j] == 'string' ?
                        (this.data[i][j] as string)
                    :   rgbToId(this.data[i][j]).id
                display.setPixel(this.pos[0] + i, this.pos[1] + j, pix)
            }
        }
    }
    drawTextAt(
        pos: [number, number],
        text: string,
        maxX = this.x - 1,
        on: pixel = display.black,
        spacing = 0,
    ) {
        let [y, x] = pos
        for (let i of text) {
            if (i == '\n') {
                x = pos[1]
                y += meta.height + 1
                continue
            }
            let { width, height } = font[i as keyof typeof font]
            if (width + x > maxX) {
                x = pos[1]
                y += meta.height + 1
            }
            this.drawCharAt([y + meta.height, x], i, on)
            x += width + spacing
        }
    }
    drawCharAt(pos: [number, number], text: string, on: pixel = display.black) {
        let { width, height, pixels } = font[text as keyof typeof font]
        let idx = 0
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++, idx++) {
                if (pixels[idx] == '1')
                    this.data[pos[0] - height + i][pos[1] + j] = on
            }
        }
    }
    drawBitmap(
        pos: [number, number],
        height: number,
        width: number,
        bitmap: pixel[],
    ) {
        for (let i = 0, idx = 0; i < height; i++) {
            for (let j = 0; j < width; j++, idx++) {
                this.data[pos[0] + i][pos[1] + j] = bitmap[idx]
            }
        }
    }
    fillRect(
        miny = 0,
        maxy = this.y - 1,
        minx = 0,
        maxx = this.x - 1,
        fill = display.white,
    ) {
        for (let i = miny; i < maxy; i++) {
            for (let j = minx; j < maxx; j++) {
                this.data[i][j] = fill
            }
        }
    }
}
export function getTextColumnAmount(text: string) {
    let out = 0
    for (let i of text) {
        out += font[i as keyof typeof font].width + 1
    }
    return out
}
export function trimStringBackwards(text: string, width: number) {
    let out = ''
    let amt = 0
    let idx = text.length - 1
    while (amt < width && idx > -1) {
        amt += font[text[idx] as keyof typeof font].width + 1
        out = text[idx] + out
        idx--
    }
    return amt < width ? text : out.slice(0, -1)
}
export function splitString(text: string, length: number) {
    let out = []
    let cur = '',
        curWidth = 0
    for (let i of text) {
        if (curWidth + font[i as keyof typeof font].width + 1 > length) {
            out.push(cur)
            cur = ''
        }
        cur += i
        curWidth += font[i as keyof typeof font].width + 1
    }
    out.push(cur)
    return out
}
export function splitBox(text: string, y: number, x: number) {
    let out = []

    let cur = '',
        curPos = [0, 0]
    for (let i of text) {
        if (i == '\n') {
            curPos[0] += meta.height + 1
            curPos[1] = 0
            if (curPos[0] + meta.height + 1 > y) {
                out.push(cur)
                cur = ''
                curPos = [0, 0]
            } else {
                cur += '\n'
            }
            continue
        }
        if (curPos[1] + font[i as keyof typeof font].width + 1 > x) {
            curPos[1] = 0
            curPos[0] += meta.height + 1
        }
        if (curPos[0] + meta.height + 1 > y) {
            out.push(cur)
            cur = i
            curPos = [0, 0]
        } else {
            cur += i
            curPos[1] += font[i as keyof typeof font].width + 1
        }
    }
    out.push(cur)
    return out
}
