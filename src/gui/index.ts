export * from './screen.ts'
export * from './windowManager.ts'
export * from './cursors.ts'
export * from './windows.ts'
export * from './draggableWindows.ts'

import { callbackManager } from '../boot/callbackManager.ts'
import { display } from './screen.ts'
import { windows } from './windowManager.ts'
import { BasicWindow } from './windows.ts'
import { cursorPos } from './cursors.ts'
{
    let cursorWindow = new BasicWindow(3, 3, [0, 0])
    cursorWindow.drawBitmap(
        [0, 0],
        [
            [display.black, display.white, display.white],
            [display.white, display.black, display.black],
            [display.white, display.black, display.white],
        ],
    )
    cursorWindow.hide()
    callbackManager.createCallback('tick', function () {
        display.fill()
        windows.render()
        cursorWindow.pos = cursorPos
        cursorWindow.render()
        display.render()
    })
}
