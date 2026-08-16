import './async.ts'

type rawFile = [number, number]
// Functions starting with an _ assume the file is already loaded and take in raw file input instead of filenames.
// Chapters are the smallest units of files: individual customDescriptions.
// Pages are the next-largest component, using chests.
// File Config Page: -1
class Disk {
    itemsInChest = 36
    netLength = 380

    hash(s: string): rawFile {
        let out = 5381
        for (let i = 0; i < s.length; i++) {
            out = (out << 5) + out + s.charCodeAt(i)
        }
        const maxValue = 399999
        let x = out % maxValue
        let y = Math.floor(out / maxValue) % maxValue
        return [x, y]
    }
    splitIntoChunks(str: string, len: number): string[] {
        let out = []
        for (let i = 0; i < str.length; i += len) {
            out.push(str.slice(i, i + len))
        }
        return out
    }
    _setFileNet(f: rawFile, page: number, idx: number, contents: string): void {
        api.setStandardChestItemSlot([...f, page], idx, 'Net', 1, null, {
            customDescription: contents,
        })
    }
    _getFileNet(f: rawFile, page: number, idx: number): string {
        return (
            api.getStandardChestItemSlot([...f, page], idx)?.attributes
                ?.customDescription || ''
        )
    }
    _getFilePage(f: rawFile, page: number): string {
        let out = ''
        for (let i = 0; i < this.itemsInChest; i++) {
            let v = this._getFileNet(f, page, i)
            out += v
            if (v == '') return out
        }
        return out
    }
    _setFilePage(f: rawFile, page: number, contents: string) {
        let nets = this.splitIntoChunks(contents, this.netLength)
        for (let i = 0; i < this.itemsInChest; i++) {
            this._setFileNet(f, page, i, nets[i] || '')
        }
    }
    *_getFile(
        f: rawFile,
        speed = 2,
        pages = null,
    ): Generator<void, string, void> {
        if (pages == null) {
            pages = JSON.parse(this._getFilePage(f, 0)).pages
        }
        let out = ''
        for (let i = 1; i <= (pages as unknown as number); i++) {
            out += this._getFilePage(f, i)
            if (i % speed == 0) yield
        }
        return out
    }
    *getFile(f: string, speed = 2): Generator<void, string, void> {
        let z: rawFile = this.hash(f)
        let pages = yield* this._loadFile(z)
        return yield* this._getFile(z, speed, pages)
    }
    *_setFile(f: rawFile, contents: string, speed = 2) {
        let pages = this.splitIntoChunks(
            contents,
            this.netLength * this.itemsInChest,
        )
        this._setFilePage(f, 0, `{"pages": ${pages.length.toString()}}`)
        for (let i = 0; i < pages.length; i++) {
            this._setFilePage(f, i + 1, pages[i] as string)
            if (i % speed == 0) yield
        }
    }
    *setFile(f: string, contents: string, speed = 2) {
        let z: rawFile = this.hash(f)
        yield* this._loadFile(z)
        yield* this._setFile(z, contents, speed)
    }
    *_loadFile(f: rawFile) {
        yield* this.loadChunk([...f, 0])
        let { pages } = JSON.parse(this._getFilePage(f, 0))
        for (let i = 32; i <= (-32 & pages); i += 32) {
            yield* this.loadChunk([...f, i])
        }
        return pages
    }
    *loadChunk(pos: [number, number, number]) {
        while (api.getBlockId(...pos) === 1) {
            yield
        }
    }

    *createNewVolume(name: string) {
        let f = this.hash(name)
        yield* this.loadChunk([...f, 0])
        this._setFilePage(f, 0, '{"pages": 1}')
        this._setFilePage(f, 1, '{"children": []}')
    }
    *createNewFile(parent: string, name: string) {
        let child = this.hash(this.joinPath(parent, name))
        let parentFile = this.hash(parent)
        yield* this._loadFile(parentFile)

        let parentFileContents = JSON.parse(yield* this._getFile(parentFile))
        parentFileContents.children.push(name)
        yield* this._setFile(parentFile, JSON.stringify(parentFileContents))

        yield* this.loadChunk([...child, 0])
        this._setFilePage(child, 0, '{"pages": 0}')
    }
    joinPath(...args: string[]): string {
        return args.join('/')
    }
    popPath(path: string, amount = 1) {
        return path.split('/').slice(0, -amount).join('/')
    }
    constructor() {}
}
export const fs = new Disk()
