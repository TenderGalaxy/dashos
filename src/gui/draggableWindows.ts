import { BasicWindow } from './windows.ts'
import { windows } from './windowManager.ts'
import { display } from './screen.ts'

export class DraggableWindow extends BasicWindow {
    constructor(
        y: number,
        x: number,
        pos: [number, number],
        man: typeof windows = windows,
    ) {
        if (y < 7) {
            throw new Error('Window is too small.')
        }
        super(y, x, pos, man)
        this.fillBorder(display.black)
        this.drawBitmap(
            [2, 2],
            [
                [display.black, display.white, display.black],
                [display.white, display.black, display.white],
                [display.black, display.white, display.black],
            ],
        )
        for (let i = 0; i < x; i++) {
            this.data[6][i] = display.black
        }
    }
    click(cursorPos: [number, number]) {
        let relativeCPos: [number, number] = [
            cursorPos[0] - this.pos[0],
            cursorPos[1] - this.pos[1],
        ]
        if (
            relativeCPos[0] < 0 ||
            relativeCPos[0] >= this.y ||
            relativeCPos[1] < 0 ||
            relativeCPos[1] >= this.x
        )
            return
        if (
            relativeCPos[0] >= 2 &&
            relativeCPos[0] <= 5 &&
            relativeCPos[1] >= 2 &&
            relativeCPos[1] <= 5
        )
            this.hide()
        if (this.isFrontWindow()) {
            this.onClick(relativeCPos)
        } else {
            this.bringToFront()
        }
    }
    onClick = function (cursorPos: [number, number]) {}
    isFrontWindow() {
        return this.man.regist[0] == this.id
    }
}
