export default class UniqueValuesLinkedList {
    before = new Map<any, any>()
    after = new Map<any, any>()

    end = 0
    start = 0
    length = 0
    last = 0
    constructor() {}

    push(k: any) {
        if (this.length == 0) {
            this.start = k
            this.end = k
            this.before.set(k, null)
            this.after.set(k, null)
        } else {
            this.before.set(k, this.end)
            this.after.set(k, null)
            this.after.set(this.end, k)
            this.end = k
        }
        this.length++
    }
    pushFront(k: any) {
        if (this.length == 0) {
            this.start = k
            this.end = k
            this.before.set(k, null)
            this.after.set(k, null)
        } else {
            this.before.set(k, null)
            this.after.set(k, this.start)
            this.before.set(this.start, k)
            this.start = k
        }
        this.length++
    }
    pop() {
        let end = this.end
        if (this.length == 0) {
            return null
        } else if (this.length == 1) {
            this.end = this.before.get(end)
            this.after.set(end, null)
            this.after.delete(end)
            this.before.delete(end)
        } else {
            this.end = this.before.get(end)
            this.after.set(this.end, null)
            this.before.delete(end)
            this.after.delete(end)
        }
        this.length--
        return end
    }
    shift() {
        let start = this.start
        if (this.length == 0) {
            return null
        } else if (this.length == 1) {
            this.start = this.after.get(start)
            this.before.set(start, null)
            this.after.delete(start)
            this.before.delete(start)
        } else {
            this.end = this.after.get(start)
            this.before.set(this.end, null)
            this.before.delete(start)
            this.after.delete(start)
        }
        this.length--
        return start
    }
}
