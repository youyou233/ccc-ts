
import { ResType } from "../utils/enum"
import PoolManager from "../manager/pool_manager"

import EffectManager from "../manager/effect_manager"
import ResourceManager from "../manager/resources_manager"
import config from "../utils/config"
import JsonManager from "../manager/json_manager"


const { ccclass, property } = cc._decorator

@ccclass
export default class EffectItem extends cc.Component {
    //文字
    @property(cc.Animation)
    anima: cc.Animation = null
    isMoney: boolean = false
    recycle: boolean = false

    /**
     * @param effectId  特效id
     * @param pos 特效位置
     * @param recycle 是否回收特效
     */
    init(effectId: string, pos: cc.Vec3 | cc.Vec2, recycle: boolean = false) {
        let name = effectId
        this.recycle = recycle
        let clips = this.anima.getClips()
        this.node.setPosition(pos)
        this.node.scale = 1
        this.node.opacity = 255
        if (this.timer) clearTimeout(this.timer)
        //  this.node.getComponent(cc.Sprite).spriteFrame = null
        if (clips.some((item: cc.AnimationClip) => {
            return item.name == name
        })) {
            this.playAnima(name)
        } else {
            ResourceManager.instance.getAnimation(effectId, true).then((res: cc.AnimationClip) => {
                this.anima.addClip(res)
                this.playAnima(name)
            })
        }
    }
    timer: any = null

    playAnima(name) {
        this.anima.play(name)
        let clips = this.anima.currentClip
        this.timer = setTimeout(() => {
            if (this.recycle) {
                this.anima.stop()
                this.node.getComponent(cc.Sprite).spriteFrame = null
                PoolManager.instance.removeObject(this.node)
            }
        }, 999/ clips.speed)
    }


}
