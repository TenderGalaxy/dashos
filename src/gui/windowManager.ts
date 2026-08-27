import { callbackManager } from '../boot/callbackManager.ts'
import { cursorPos } from './cursors.ts'
export const windows = {
    regist: Array<string>(),
    funcs: {} as Record<string, Window>,
    add(rend: Window, id: string) {
        this.regist.push(id)
        this.funcs[id] = rend
    },
    bringToFront(id: string) {
        this.regist.splice(this.regist.indexOf(id), 1)
        this.regist.push(id)
    },
    sendToBack(id: string) {
        this.regist.splice(this.regist.indexOf(id), 1)
        this.regist.unshift(id)
    },
    hideWindow(id: string) {
        this.regist.splice(this.regist.indexOf(id), 1)
    },
    render() {
        for (let i of this.regist) {
            this.funcs[i].render()
        }
    },
    clearAllWindows() {
        this.regist = []
        this.funcs = {}
    },
}
callbackManager.createCallback('onPlayerClick', function () {
    // Unfortunately we have to use backwards iteration here :(
    for (let i = windows.regist.length - 1; i >= 0; i--) {
        if (windows.funcs[windows.regist[i]].click(cursorPos)) return
    }
})
export interface Window {
    click(pos: [number, number]): boolean
    render(): void
}
