import { DraggableWindow } from '../gui/draggableWindows.ts'
import { fs } from '../boot/fs.ts'
export function* createFSExplorerWindow(
    y: number,
    x: number,
    pos: [number, number],
    path = 'dashos',
) {
    const contents = yield* fs.readdir(path)
    let currentPage = 0
    const maxStringLen = Math.floor((x - 4) / 4)
    const filesPerPage = Math.floor((y - 14) / 6)
    let win = new DraggableWindow(y, x, pos)
    win.drawTextAt([8, 6], (path + '/').slice(-maxStringLen))
    win.drawTextAt([14, 6], 'Return | Refresh')
    for (
        let i = currentPage * filesPerPage, j = 0;
        i <
        Math.min(currentPage * filesPerPage + filesPerPage, contents.length);
        i++, j++
    ) {
        win.drawTextAt([20 + j * 6, 6], contents[j])
    }
}
