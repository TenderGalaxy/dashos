type position = [number, number, number]
interface GameEngine {
    tickLength: number
    getChunk(p: position): string
    setStandardChestItemSlot(
        pos: position,
        idx: number,
        name: string,
        amount: number,
        id: number | undefined,
        val: { customDescription: string },
    ): void
    getStandardChestItemSlot(
        pos: position,
        idx: number,
    ): { attributes: { customDescription: string } }
    getBlockId(pos: position): number
    posIdxToItem(pos: position, idx: number): string

    isLoaded(pos: position): boolean
    load(pos: position): void
    isNearInterrupt(): boolean
}
declare const api: GameEngine
