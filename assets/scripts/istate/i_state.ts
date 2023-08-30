

export class IState {
    item: any = null
    timer: number = 0
    constructor(item) {
        this.item = item
    }
    onEnter() { }
    onExit() { }
    onUpdate(dt) { }
}

