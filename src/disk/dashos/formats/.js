parse = function* (path, contents) {
    return JSON.parse(contents).children
}
view = function* (path, contents) {
    yield* createFSExplorerWindow(path)
}
