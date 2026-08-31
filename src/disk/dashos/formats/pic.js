parse = function* (path, contents) {
    let h = contents[0].codePointAt(),
        w = contents[1].codePointAt()
    return [
        h - 70,
        w - 70,
        contents.slice(2).map((i) => (i.codePointAt() - 70).toString()),
    ]
}
view = function* (path, contents) {
    let h = contents[0].codePointAt() - 70,
        w = contents[1].codePointAt() - 70
    let t = [...contents.slice(2)].map((i) => (i.codePointAt() - 70).toString())
    let win = new DraggableWindow(h + 12, w + 4, [2, 2])
    win.drawBitmap([8, 2], h, w, t)
}
