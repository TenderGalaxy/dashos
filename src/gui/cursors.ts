import { display } from './screen.ts'
import { user } from '../utils/user.ts'
import { callbacks } from '../boot/callbackManager.ts'

export let cursorPos: [number, number] = [0, 0]
callbacks.tick.push(function () {
    const { dir, camPos } = api.getPlayerFacingInfo(user)
    const scaling = (display.pos[2] - camPos[2]) / dir[2]
    let pPos = [
        (dir[0] + display.pos[0] - camPos[0]) * scaling - display.x / 2,
        display.y - (dir[1] + display.pos[1] - camPos[1]) * scaling,
    ]
    if (
        0 <= pPos[0] &&
        pPos[0] < display.x &&
        0 <= pPos[1] &&
        pPos[1] < display.y
    ) {
        cursorPos = [pPos[0], pPos[1]]
    }
})
