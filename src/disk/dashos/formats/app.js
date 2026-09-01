view = function* (path, contents) {
    return new Thread(eval(contents))
}
