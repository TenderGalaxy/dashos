import { callbacks } from '../boot/callbackManager.ts'
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
        this.regist.splice(this.regist.indexOf(id, 1))
        this.regist.unshift(id)
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
callbacks.onPlayerClick.push(function () {
    for (let i of windows.regist) {
        windows.funcs[i].click(cursorPos)
    }
})
export interface Window {
    click(pos: [number, number]): void
    render(): void
}
