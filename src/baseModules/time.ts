import { callbacks } from './callbackManager.ts'
callbacks!.tick!.push(function () {
    time++
})
export let time = 0
