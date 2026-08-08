import { api } from '../../testing/api.ts'
import './async.ts'

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
    _getFile(f: rawFile): string {
        let { pages } = JSON.parse(this._getFilePage(f, -1))
        return Array.from({ length: pages }, (_, i) =>
            this._getFilePage(f, i),
        ).join('')
    }
    _setFile(f: rawFile, contents: string) {
        let pages = this.splitIntoChunks(
            contents,
            this.chapterLength * this.itemsInChest,
        )
        for (let i = 0; i < pages.length; i++) {
            this._setFilePage(f, i, pages[i] as string)
        }
    }

    constructor() {}
}
export const fs = new Disk()
