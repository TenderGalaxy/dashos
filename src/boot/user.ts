export let user = ''
import { callbackManager } from './callbackManager.ts'

let n = callbackManager.createCallback('tick', function () {
    let z = api.getPlayerIds()
    if (z.length > 0) {
        user = z[0]
        api.log(`Assigned DashOS Usership to ${api.getEntityName(user)}`)
        callbackManager.deleteCallback('tick', n)
    }
})
