import './async.ts'

type rawFile = [number, number]
// Functions starting with an _ assume the file is already loaded and take in raw file input instead of filenames.
// Nets are the smallest units of files: individual customDescriptions.
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
    _writeFileNet(
        f: rawFile,
        page: number,
        idx: number,
        contents: string,
    ): void {
        api.setStandardChestItemSlot([...f, page], idx, 'Net', 1, undefined, {
            customDescription: contents,
        })
    }
    _readFileNet(f: rawFile, page: number, idx: number): string {
        return (
            api.getStandardChestItemSlot([...f, page], idx)?.attributes
                ?.customDescription || ''
        )
    }
    _readFilePage(f: rawFile, page: number): string {
        let out = ''
        for (let i = 0; i < this.itemsInChest; i++) {
            let v = this._readFileNet(f, page, i)
            out += v
            if (v == '') return out
        }
        return out
    }
    _writeFilePage(f: rawFile, page: number, contents: string) {
        let nets = this.splitIntoChunks(contents, this.netLength)
        for (let i = 0; i < this.itemsInChest; i++) {
            this._writeFileNet(f, page, i, nets[i] || '')
        }
    }
    *_readFile(
        f: rawFile,
        speed = 2,
        pages = null,
    ): Generator<void, string, void> {
        if (pages == null) {
            pages = JSON.parse(this._readFilePage(f, 0)).pages
        }
        let out = ''
        for (let i = 1; i <= (pages as unknown as number); i++) {
            out += this._readFilePage(f, i)
            if (i % speed == 0) yield
        }
        return out
    }
    *readFile(f: string, speed = 2): Generator<void, string, void> {
        let z: rawFile = this.hash(f)
        let pages = yield* this._loadFile(z)
        return yield* this._readFile(z, speed, pages)
    }
    *_writeFile(f: rawFile, contents: string, speed = 2) {
        let pages = this.splitIntoChunks(
            contents,
            this.netLength * this.itemsInChest,
        )
        this._writeFilePage(f, 0, `{"pages": ${pages.length.toString()}}`)
        for (let i = 0; i < pages.length; i++) {
            this._writeFilePage(f, i + 1, pages[i] as string)
            if (i % speed == 0) yield
        }
    }
    *writeFile(f: string, contents: string, speed = 2) {
        let z: rawFile = this.hash(f)
        yield* this._loadFile(z)
        yield* this._writeFile(z, contents, speed)
    }
    *_loadFile(f: rawFile) {
        yield* this.loadChunk([...f, 0])
        let { pages } = JSON.parse(this._readFilePage(f, 0))
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
        this._writeFilePage(f, 0, '{"pages": 1}')
        this._writeFilePage(f, 1, '{"children": []}')
    }
    *touch(name: string) {
        let spl = name.split('/')
        let parentName = spl.slice(0, -1).join('/')
        let childName = spl[spl.length - 1]
        let parentFileContents = JSON.parse(yield* this.readFile(parentName))
        if (parentFileContents.children.indexOf(childName) == -1)
            parentFileContents.children.push(childName)
        yield* this.writeFile(parentName, JSON.stringify(parentFileContents))
        let child = this.hash(name)
        yield* this.loadChunk([...child, 0])
        this._writeFilePage(child, 0, '{"pages": 0}')
    }
    *mkdir(name: string) {
        yield* this.touch(name)
        yield* this.writeFile(this.joinPath(name), '{"children": []}')
    }
    *readdir(file: string) {
        const c = yield* this.readFile(file)
        return JSON.parse(c).children
    }
    *deleteFile(name: string) {
        let v = name.split('/')
        let parent = v.slice(0, -1).join('/')
        let child = v[v.length - 1]
        let parentC = yield* this.readdir(parent)
        parentC.splice(parentC.indexOf(child), 1)
        yield* this.writeFile(parent, JSON.stringify({ children: parentC }))
    }
    *isFile(name: string) {
        let v = this.hash(name)
        yield* this.loadChunk([...v, 0])
        return this._readFilePage(v, 0) != ''
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
//rm, copyFile, appendFile
