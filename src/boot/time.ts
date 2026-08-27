import { callbackManager } from './callbackManager.ts'
export let time = 0

callbackManager.createCallback('tick', () => time++)
