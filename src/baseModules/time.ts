import { callbacks } from './callbackManager.js'
export let time = 0

callbacks!.tick!.push(() => time++)
