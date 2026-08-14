import { callbacks } from './callbackManager.ts'
export let time = 0

callbacks!.tick!.push(() => time++)
