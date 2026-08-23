import icons from '../utils/icons.json' with { type: 'json' }
import { Thread } from '../boot/async.ts'
import { createFSExplorerWindow } from './windows.ts'
new Thread(createFSExplorerWindow(60, 124, [2, 2]))
