import { Thread } from '../boot/async.ts'
import { fs } from '../boot/fs.ts'
import { BasicWindow } from '../gui/windows.ts'
new Thread(
    (function* () {
        if (yield* fs.isFile('dashos/config')) return
        console.log('DashOS Config not found... wiping disks...')
        yield* fs.createNewVolume('dashos')
        yield* fs.createNewVolume('user')

        let win = new BasicWindow(64, 128, [0, 0])
        win.drawTextAt([2, 2], 'Urgent: Install data.js.')
        win.drawTextAt([10, 2], 'DashOS will not be functional until you do.')
    })(),
)
