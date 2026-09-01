import { DraggableWindow } from '../gui/draggableWindows.ts'
import { fs } from '../boot/fs.ts'
import meta from '../font/fonts/defaultMeta.json' with { type: 'json' }
import { Thread, thl } from '../boot/async.ts'
import { splitBox, trimStringBackwards } from '../gui/windows.ts'
//@ts-expect-error
import contextualEval from './witheval.js'
export * from './install.ts'
import { writeSchematic, readSchematic } from './schematic.ts'
import {
  alert,
  createConfirmationWindow,
  createTextInput,
} from './inputWindows.ts'
const root = 'user'
const clipboardPos: [number, number, number] = [0, 96, 0]

function* parseFile(path: string) {
  let ctx = {
    parse: function* (path: string, contents: string) {
      return contents
    },
    view: function* (path: string, contents: string) {
      return createTextViewer(path, contents, 54, 118, [5, 5])
    },
  }
  let extension = path.split('.').at(-1)
  if (yield* fs.isFile(`dashos/formats/${extension}.js`)) {
    contextualEval(ctx, yield* fs.readFile(`dashos/formats/${extension}.js`))
  }
  yield* ctx.view(path, yield* fs.readFile(path))
}

function createTextViewer(
  path: string,
  contents: string,
  y: number,
  x: number,
  pos: [number, number],
) {
  let win = new DraggableWindow(y, x, pos)
  win.drawTextAt([8, 18], trimStringBackwards(path, x - 20))
  win.drawTextAt([8, 2], '<')
  win.drawTextAt([8, 10], '>')
  let split = splitBox(contents, y - 14, x - 2)
  let page = 0
  win.drawTextAt([14, 2], split[page])
  win.onClick = function (pos) {
    if (pos[0] < 14) {
      if (pos[1] < 10) {
        page--
      } else if (pos[1] < 18) {
        page++
      }
      if (page == -1) page = 0
      if (page == split.length) page = split.length - 1
      win.fillRect(14, y - 2, 2, x - 2)
      win.drawTextAt([14, 2], split[page])
    }
  }
}
function createFileViewWindow(
  y: number,
  x: number,
  pos: [number, number],
  path: string,
): (res: (val: any) => void) => void {
  return function (res: (val: any) => void) {
    new Thread(
      (function* () {
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
        win.drawTextAt([30, x >> 1], 'Copy')
        win.onClose = () => res(false)
        win.onClick = function (pos) {
          new Thread(
            (function* () {
              if (pos[0] < 21 || pos[0] > 30 + meta.height) return
              if (pos[1] > x >> 1) {
                if (pos[0] > 30) {
                  writeSchematic(
                    path.split('/').at(-1) as string,
                    yield* fs.readFile(path),
                    clipboardPos,
                  )
                  win.hide()
                  res(false)
                } else {
                  alert(
                    'Unimplemented: RenameFile. Please report this issue.',
                    80,
                  )
                  win.hide()
                  res(true)
                }
                return
              }

              if (pos[0] > 29) {
                yield* parseFile(path)
                win.hide()
                res(true)
                return
              }
              if (yield thl.awaitPromise(createConfirmationWindow())) {
                yield* fs.deleteFile(path)
                win.hide()
                res(true)
              }
            })(),
          )
        }
      })(),
    )
  }
}
function createFolderOptionsWindow(
  path = root,
  y = 50,
  x = 80,
  pos: [number, number] = [5, 5],
): (res: (val: any) => void) => void {
  return function (res: (val: any) => void) {
    let win = new DraggableWindow(y, x, pos)
    win.drawTextAt([8, 2], 'Paste from clipboard')
    win.drawTextAt([14, 2], 'Refresh directory')
    win.drawTextAt([20, 2], 'Create blank file')
    win.onClose = () => res(false)
    win.onClick = function (pos) {
      new Thread(
        (function* () {
          if (pos[0] < 14) {
            const { contents, name } = readSchematic(clipboardPos)
            yield* fs.touch(path + '/' + name)
            yield* fs.writeFile(path + '/' + name, contents)
            win.hide()
            res(true)
          }
          if (pos[0] < 20) {
            win.hide()
            res(true)
          }
          let v = yield thl.awaitPromise(createTextInput())
          yield* fs.touch(`${path}/${v}`)
          win.hide()
          res(true)
        })(),
      )
    }
  }
}
function* createFSExplorerWindow(
  y: number,
  x: number,
  pos: [number, number],
  path = root,
) {
  let currentPage = 0
  const filesPerPage = Math.floor((y - 14) / (meta.height + 1))
  let win = new DraggableWindow(y, x, pos)
  win.drawTextAt([8, 2], trimStringBackwards(path, x - 2))
  win.drawTextAt([14, 2], 'Return')
  win.drawTextAt([14, x >> 1], 'Options')
  let dirContents: string[] = []
  function* refreshListing() {
    dirContents = yield* fs.readdir(path)
    let f = Math.min(
      currentPage * filesPerPage + filesPerPage,
      dirContents.length,
    )
    win.fillRect(20, y - 2, 1, x - 2)
    for (let i = currentPage * filesPerPage, j = 0; i < f; i++, j++) {
      win.drawTextAt([20 + j * (meta.height + 1), 9], dirContents[j] || 'ERROR')
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
              alert("FileExplorer: You're already at the root folder!", 60)
            }
            yield* refreshListing()
          } else {
            if (yield thl.awaitPromise(createFolderOptionsWindow(path))) {
              yield* refreshListing()
            }
          }
          return
        }
        if (rcPos[0] >= 14 + meta.height) {
          let idx =
            currentPage * filesPerPage +
            Math.floor((rcPos[0] - 14 - meta.height) / (meta.height + 1))
          if (dirContents[idx]) {
            if (
              yield thl.awaitPromise(
                createFileViewWindow(
                  50,
                  80,
                  [10, 10],
                  fs.joinPath(path, dirContents[idx]),
                ),
              )
            ) {
              yield* refreshListing()
            }
          }
        }
      })(),
    )
  }
}
new Thread(createFSExplorerWindow(60, 124, [2, 2]))
