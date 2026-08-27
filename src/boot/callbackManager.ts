let callbackNames = [
    'tick',
    'onClose',
    'onPlayerJoin',
    'onPlayerLeave',
    'onPlayerJump',
    'onRespawnRequest',
    'playerCommand',
    'onPlayerChat',
    'onPlayerChangeBlock',
    'onPlayerDropItem',
    'onPlayerPickedUpItem',
    'onPlayerSelectInventorySlot',
    'onBlockStand',
    'onPlayerAttemptCraft',
    'onPlayerCraft',
    'onPlayerAttemptOpenChest',
    'onPlayerOpenedChest',
    'onPlayerMoveItemOutOfInventory',
    'onPlayerMoveInvenItem',
    'onPlayerMoveItemIntoIdxs',
    'onPlayerSwapInvenSlots',
    'onPlayerMoveInvenItemWithAmt',
    'onPlayerAttemptAltAction',
    'onPlayerAltAction',
    'onPlayerClick',
    'onClientOptionUpdated',
    'onMobSettingUpdated',
    'onInventoryUpdated',
    'onChestUpdated',
    'onWorldChangeBlock',
    'onCreateBloxdMeshEntity',
    'onEntityCollision',
    'onPlayerAttemptSpawnMob',
    'onWorldAttemptSpawnMob',
    'onPlayerSpawnMob',
    'onWorldSpawnMob',
    'onWorldAttemptDespawnMob',
    'onMobDespawned',
    'onPlayerAttack',
    'onPlayerDamagingOtherPlayer',
    'onPlayerDamagingMob',
    'onMobDamagingPlayer',
    'onMobDamagingOtherMob',
    'onAttemptKillPlayer',
    'onPlayerKilledOtherPlayer',
    'onMobKilledPlayer',
    'onPlayerKilledMob',
    'onMobKilledOtherMob',
    'onPlayerPotionEffect',
    'onPlayerDamagingMeshEntity',
    'onPlayerBreakMeshEntity',
    'onPlayerUsedThrowable',
    'onPlayerThrowableHitTerrain',
    'onTouchscreenActionButton',
    'onTaskClaimed',
    'onChunkLoaded',
    'onPlayerRequestChunk',
    'onItemDropCreated',
    'onPlayerStartChargingItem',
    'onPlayerFinishChargingItem',
    'onPlayerFinishQTE',
    'doPeriodicSave',
]

export const callbackManager = {
    regist: Object.fromEntries(
        callbackNames.map((i) => [
            i,
            {
                regist: {},
                funcs: [],
            },
        ]),
    ),
    createCallback(name: string, func: () => void) {
        const id = Math.random().toString(36)
        //@ts-expect-error
        this.regist[name].regist[id] = func
        //@ts-expect-error
        this.regist[name].funcs.push(id)
        return id
    },
    deleteCallback(name: string, id: string) {
        //@ts-expect-error
        this.regist[name].funcs.splice(this.regist[name].funcs.indexOf(id), 1)
        //@ts-expect-error
        delete this.regist[name].regist[id]
    },
    prioritizeCallback(name: string, id: string) {
        //@ts-expect-error
        this.regist[name].funcs.splice(this.regist[name].funcs.indexOf(id), 1)
        //@ts-expect-error
        this.regist[name].funcs.push(id)
    },
}

for (let callback of callbackNames) {
    // @ts-expect-error
    globalThis[callback] = function () {
        let returnValue: any = undefined
        for (let j of callbackManager.regist[callback].funcs) {
            let out = (callbackManager.regist[callback].regist[j] as Function)(
                ...arguments,
            )
            if (out != undefined) {
                returnValue = out
            }
        }
        return returnValue
    }
}
