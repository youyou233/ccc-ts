import EffectManager from "../manager/effect_manager"
import PoolManager from "../manager/pool_manager"
import { Utils } from "../utils/utils"

const { ccclass, property } = cc._decorator

interface DamageLabelParam {
    color: cc.Color,
    outLineColor: cc.Color,
    fontSize: number
    cri?: boolean
}

@ccclass
export default class DamageLabel extends cc.Component {
    //文字
    @property(cc.Label)
    label: cc.Label = null
    @property(cc.LabelOutline)
    outLine: cc.LabelOutline = null
    onLoad() {
        // this.label = this.node.getComponent(cc.Label)
        // this.outLine = this.node.getComponent(cc.LabelOutline)
    }
    /**
     * 
     * @param str 
     * @param pos 
     * @param posX 位移 
     * @param cri 
     * @param param 
     */
    init(str: string, pos: cc.Vec2, posX: number, param: DamageLabelParam) {
        this.node.setPosition(pos)
        this.label.string = str
        this.node.opacity = 255
        if (param) {
            this.node.color = param.color
            this.outLine.color = param.outLineColor
            this.label.fontSize = param.fontSize
            if (param.cri) {
                this.label.string = '✦' + this.label.string
                this.label.fontSize = param.fontSize * 1.5
                EffectManager.instance.createEffect('shine0012', pos, this.node)
            }
        } else {
            this.node.color = cc.Color.WHITE
            this.outLine.color = cc.Color.BLACK
            this.label.fontSize = 36
        }
        this.node.scaleX = 1
        this.node.scaleY = 1
        //     if (cri) {

        //     } else {
        //         this.node.color = cc.Color.WHITE
        //         this.outLine.color = cc.Color.BLACK
        //         this.label.fontSize = 12
        //     }
        // }
        this.showAni(posX)
    }

    showAni(posX) {
        let div = Utils.getRandomNumber(posX / 2.5) + posX / 2.5 //Utils.getNormalDivByAngel()
        let targetPos = cc.v2(Utils.getRandomNumber(posX) - posX / 2, div)
        cc.tween(this.node)
            .by(0.3, { x: targetPos.x, y: targetPos.y }, cc.easeOut(3))
            .delay(0.15)
            .sequence(
                cc.tween().by(0.1, { y: -10 }, cc.easeIn(3)),
                cc.tween().parallel(
                    cc.tween().to(0.1, { scaleX: 0.2, scaleY: 2 }, cc.easeOut(3)),
                    cc.tween().to(0.2, { opacity: 0 })
                )
            )
            .call(() => {
                PoolManager.instance.removeObject(this.node)
            })
            .start()
        // if (posX > 0) {

        // } else {

        // }
    }
}