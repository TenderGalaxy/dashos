import { display } from './screen.ts'
import { user } from '../utils/user.ts'
import { callbacks } from '../boot/callbackManager.ts'

export let cursorPos: [number, number] = [0, 0]
callbacks.tick.push(function () {
    const { dir, camPos } = api.getPlayerFacingInfo(user as string)
    const scaling = (display.pos[2] - camPos[2]) / dir[2]
    let pPos = [
        display.pos[1] + display.y - dir[1] * scaling - camPos[1],
        dir[0] * scaling + camPos[0] + (display.x >> 1) - display.pos[0],
    ].map(Math.floor)
    if (
        0 <= pPos[1] &&
        pPos[0] < display.y &&
        0 <= pPos[0] &&
        pPos[1] < display.x
    ) {
        cursorPos = [pPos[0], pPos[1]] as [number, number]
    }
})
