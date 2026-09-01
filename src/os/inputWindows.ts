import { DraggableWindow } from '../gui/draggableWindows.ts'
import meta from '../font/fonts/defaultMeta.json' with { type: 'json' }
import { callbackManager } from '../boot/callbackManager.ts'
import { getTextColumnAmount } from '../gui/windows.ts'
import { display } from '../gui/screen.ts'
export * from './install.ts'
import { user } from '../boot/user.ts'

export function createTextInput() {
    let win = new DraggableWindow(20, 80, [20, 20])
    win.drawTextAt([8, 2], 'Type text in chat.')
    return function (res: () => void) {
        let callback = callbackManager.createCallback(
            'onPlayerChat',
            function (id: string, msg: string) {
                if (id != user) return
                callbackManager.deleteCallback('onPlayerChat', callback)
                res()
                win.hide()
            },
        )
    }
}
export function alert(text = 'Error', width = 40) {
    let amt = Math.ceil(getTextColumnAmount(text) / (width - 4))
    let usedH = amt * (meta.height + 1) + 8
    let win = new DraggableWindow(usedH, width, [
        (display.y - usedH) >> 1,
        (display.x - width) >> 1,
    ])
    win.drawTextAt([8, 2], text)
}
export function createConfirmationWindow() {
    let win = new DraggableWindow(21, 60, [30, 50])
    win.drawTextAt([8, 2], 'Are you sure?')
    win.drawTextAt([14, 2], 'Yes')
    win.drawTextAt([14, 30], 'No')
    return function (res: (val: boolean) => void) {
        win.onClick = function (p) {
            if (p[0] > 8) {
                res(p[1] < 30)
                win.hide()
            }
        }
    }
}
