import './async.js'

type rawFile = [number, number]
// Functions starting with an _ assume the file is already loaded and take in raw file input instead of filenames.
// Chapters are the smallest units of files: individual customDescriptions.
// Pages are the next-largest component, using chests.
// File Config Page: -1
class Disk {
    itemsInChest = 36
    chapterLength = 380

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
    _setFileChapter(
        f: rawFile,
        page: number,
        chapter: number,
        contents: string,
    ): void {
        api.setStandardChestItemSlot(
            [...f, page],
            chapter,
            'Net',
            1,
            undefined,
            {
                customDescription: contents,
            },
        )
    }
    _getFileChapter(f: rawFile, page: number, chapter: number): string {
        return (
            api.getStandardChestItemSlot([...f, page], chapter)?.attributes
                ?.customDescription || ''
        )
    }
    _getFilePage(f: rawFile, page: number): string {
        return Array.from({ length: this.itemsInChest }, (_, i) =>
            this._getFileChapter(f, page, i),
        ).join('')
    }
    _setFilePage(f: rawFile, page: number, contents: string) {
        let chapters = this.splitIntoChunks(contents, this.chapterLength)
        for (let i = 0; i < chapters.length; i++) {
            this._setFileChapter(f, page, i, chapters[i] as string)
        }
    }
    *_getFile(f: rawFile, speed = 2): Generator<void, string, void> {
        let { pages } = JSON.parse(this._getFilePage(f, 0))
        let out = ''
        for (let i = 1; i <= pages; i++) {
            out += this._getFilePage(f, i + 1)
            if (i % speed == 0) yield
        }
        return out
    }
    *getFile(f: string, speed = 2): Generator<void, string, void> {
        let z: rawFile = this.hash(f)
        yield* this._loadFile(z)
        return yield* this._getFile(z, speed)
    }
    *_setFile(f: rawFile, contents: string, speed = 2) {
        let pages = this.splitIntoChunks(
            contents,
            this.chapterLength * this.itemsInChest,
        )
        for (let i = 1; i <= pages.length; i++) {
            this._setFilePage(f, i, pages[i] as string)
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
    }
    *loadChunk(pos: [number, number, number]) {
        while (api.getBlockId(pos) === 1) {
            yield
        }
    }

    constructor() {}
}
export const fs = new Disk()
