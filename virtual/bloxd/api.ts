import blocks from './blockNames.json' with { type: 'json' }
import blockTextures from './blocks.json' with { type: 'json' }
import chalk from 'chalk'
type position = [number, number, number]

class GameEngine {
    constructor(tickLength: number) {
        this.tickLength = tickLength
    }
    tickLength
    screen: number[][][] = Array.from({ length: 64 }, (i) =>
        Array.from({ length: 128 }, (j) => [255, 255, 255]),
    )
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
        id: number | null,
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
    getBlockId(x: number, y: number, z: number): number {
        if (this.isLoaded([x, y, z])) {
            return 2
        } else {
            this.load([x, y, z])
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
    blockIdToBlockName(id: number) {
        return blocks[id - 2]
    }
    blockNameToBlockId(id: string) {
        return blocks.indexOf(id) + 2
    }
    setBlock(pos: position, id: string) {
        //@ts-expect-error
        this.screen[65 - pos[1]][pos[0] + 64] = (blockTextures[
            parseInt(id) - 1
        ] || blockTextures[blocks.indexOf(id)])[1][1]
    }
    renderScreen() {
        for (let i = 0; i < 64; i++) {
            let out = []
            for (let j = 0; j < 128; j++) {
                let [r, g, b] = this.screen[i][j]
                out.push(chalk.rgb(r, g, b)('█'))
            }
            out = out.flatMap((i) => [i, i])
            console.log(out.join(''))
        }
    }
}
export const api = new GameEngine(20)
declare global {
    var api: GameEngine
}
