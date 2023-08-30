import JsonManager from "../manager/json_manager"


export interface BuffData {
    id: number
    name: string
    dec: string
    param: object
    debuff: boolean
}

export class Buff {
    total: number = 0//总时长
    left: number = 0//当前剩余市场
    progress: number = 0//程度
    id: number = 0
    entity: any = null
    constructor(id, entity) {
        this.id = id
        let time = 3
        this.left = time
        this.total = time
        this.progress = 1
        this.entity = entity

    }
   
    addBuff() {
        let info = JsonManager.instance.getDataByName("buff")[this.id]
        if (info.time) {
            this.total += 3
            this.left += 3
        }
        if (info.stack) {
            this.progress += 1
        }
    }
    onUpdate(dt) {
        let info = JsonManager.instance.getDataByName("buff")[this.id]
        if (info.time) {
            this.left -= dt
            this.entity.removeBuff(this.id)
        }
    }
}