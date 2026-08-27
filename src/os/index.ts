import icons from '../utils/icons.json' with { type: 'json' }
import { DraggableWindow } from '../gui/draggableWindows.ts'
import { fs } from '../boot/fs.ts'
import meta from '../utils/font/fonts/defaultMeta.json' with { type: 'json' }
import { Thread, thl } from '../boot/async.ts'
import { getTextColumnAmount, trimStringBackwards } from '../gui/windows.ts'
import { display } from '../gui/screen.ts'

function alert(text = 'Error', width = 40) {
    let amt = Math.ceil(getTextColumnAmount(text) / (width - 4))
    let usedH = amt * (meta.height + 1) + 8
    let win = new DraggableWindow(usedH, width, [
        (display.y - usedH) >> 1,
        (display.x - width) >> 1,
    ])
    win.drawTextAt([8, 2], text)
}
function* createFileViewWindow(
    y: number,
    x: number,
    pos: [number, number],
    path: string,
) {
    if (!(yield* fs.isFile(path))) {
        alert('FileExplorer: Viewed file that does not exist.')
        return
    }
    let win = new DraggableWindow(y, x, pos)
    win.drawTextAt([8, 2], trimStringBackwards(path, x - 2))
    win.drawTextAt([16, 2], 'Options: ')
    win.drawTextAt([22, 2], 'Delete')
    win.drawTextAt([30, 2], 'Open')
    win.drawTextAt([22, x >> 1], 'Rename')
    win.onClick = function (pos) {
        new Thread(
            (function* () {
                if (pos[0] > 21 && pos[0] < 30 + meta.height) {
                    if (pos[1] > x >> 1) {
                        alert(
                            'Unimplemented: RenameFile. Please report this issue.',
                            80,
                        )
                    } else {
                        if (pos[0] > 29) {
                            alert('OpenFile')
                        } else {
                            if (
                                yield thl.awaitPromise(
                                    createConfirmationWindow(),
                                )
                            ) {
                                yield* fs.deleteFile(path)
                                win.hide()
                            }
                        }
                    }
                }
            })(),
        )
    }
}
function createConfirmationWindow() {
    let win = new DraggableWindow(21, 60, [30, 50])
    win.drawTextAt([8, 2], 'Are you sure?')
    win.drawTextAt([14, 2], 'Yes')
    win.drawTextAt([14, 30], 'No')
    return function (res: (val: boolean) => void) {
        win.onClick = function (p) {
            if (p[0] > 8) {
                res(p[1] < 30)
            }
            win.hide()
        }
    }
}
function* createFSExplorerWindow(
    y: number,
    x: number,
    pos: [number, number],
    path = 'dashos',
) {
    let currentPage = 0
    const filesPerPage = Math.floor((y - 14) / (meta.height + 1))
    let win = new DraggableWindow(y, x, pos)
    win.drawTextAt([8, 2], trimStringBackwards(path, x - 2))
    win.drawTextAt([14, 2], 'Return ')
    win.drawTextAt([14, x >> 1], 'Refresh')
    let dirContents: string[] = []
    function* refreshListing() {
        dirContents = yield* fs.readdir(path)
        let f = Math.min(
            currentPage * filesPerPage + filesPerPage,
            dirContents.length,
        )
        win.fillRect(20, y - 2, 1, x - 2)
        for (let i = currentPage * filesPerPage, j = 0; i < f; i++, j++) {
            win.drawTextAt(
                [20 + j * (meta.height + 1), 2],
                dirContents[j] || 'ERROR',
            )
        }
    }

    yield* refreshListing()
    win.onClick = function (rcPos) {
        new Thread(
            (function* () {
                if (rcPos[0] > 14 && rcPos[0] < 14 + meta.height) {
                    if (rcPos[1] < x >> 1) {
                        if (path.split('/').length > 1) {
                            path = fs.popPath(path, 1)
                        } else {
                            alert(
                                "FileExplorer: You're already at the root folder!",
                                60,
                            )
                        }
                    }
                    yield* refreshListing()
                } else if (rcPos[0] >= 14 + meta.height) {
                    let idx =
                        currentPage * filesPerPage +
                        Math.floor(
                            (rcPos[0] - 14 - meta.height) / (meta.height + 1),
                        )
                    if (dirContents[idx]) {
                        yield* createFileViewWindow(
                            50,
                            80,
                            [10, 10],
                            fs.joinPath(path, dirContents[idx]),
                        )
                    }
                }
            })(),
        )
    }
}
new Thread(createFSExplorerWindow(60, 124, [2, 2]))
