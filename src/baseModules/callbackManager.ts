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

export const callbacks: Record<string, Function[]> = Object.fromEntries(
    callbackNames.map((i) => [i, []]),
)

for (let callback of callbackNames) {
    // @ts-expect-error
    globalThis[callback] = function () {
        let returnValue: any = undefined
        for (let j of callbacks[callback]) {
            let out = (j as Function)(...arguments)
            if (out != undefined) {
                returnValue = out
            }
        }
        return returnValue
    }
}
