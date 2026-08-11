type position = [number, number, number]

class GameEngine {
    constructor(tickLength: number) {
        this.tickLength = tickLength
    }
    tickLength
    #chestData = new Map()
    #loaded = new Map()
    getChunk(p: position): string {
        return `${p[0] >> 5}|${p[1] >> 5}|${p[2] >> 5}`
    }
    setStandardChestItemSlot(
        pos: position,
        idx: number,
        name: string,
        amount: number,
        id: number | undefined,
        val: { customDescription: string },
    ): void {
        let p = this.posIdxToItem(pos, idx)
        if (!this.isLoaded(pos)) {
            throw new Error(`API: ${p} is not loaded`)
        }
        this.#chestData.set(p, val.customDescription)
    }
    getStandardChestItemSlot(
        pos: position,
        idx: number,
    ): { attributes: { customDescription: string } } {
        let p = this.posIdxToItem(pos, idx)
        if (!this.isLoaded(pos)) {
            throw new Error(`API: ${p} is not loaded.`)
        }
        return { attributes: { customDescription: this.#chestData.get(p) } }
    }
    getBlockId(pos: position): number {
        if (this.isLoaded(pos)) {
            return 2
        } else {
            this.load(pos)
            return 1
        }
    }
    posIdxToItem(pos: position, idx: number): string {
        return `${pos[0]}|${pos[1]}|${pos[2]}|${idx}`
    }

    isLoaded(pos: position): boolean {
        return (
            this.#loaded.has(this.getChunk(pos)) &&
            Date.now() - this.#loaded.get(this.getChunk(pos)) >
                3 * this.tickLength
        )
    }
    load(pos: position): void {
        if (!this.#loaded.has(this.getChunk(pos))) {
            this.#loaded.set(this.getChunk(pos), Date.now())
        }
    }
    isNearInterrupt() {
        return false
    }
}
export const api = new GameEngine(20)
declare global {
    var api: GameEngine
}
