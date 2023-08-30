import DamageLabel from "../item/damage_label";
import EffectItem from "../item/effect_item";
import GameUI from "../ui/game_ui";
import { Utils } from "../utils/utils";
import PoolManager from "./pool_manager";
import ResourceManager from "./resources_manager";

const { ccclass, property } = cc._decorator;
/**
 * 特效管理
 */

@ccclass
export default class EffectManager extends cc.Component {

    static _instance: EffectManager = null


    static get instance() {
        if (this._instance == null) {
            this._instance = new EffectManager()
        }
        return this._instance
    }
    init() {
    }
    getWorldPos(node: cc.Node, parent: cc.Node) {
        let pos = node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(cc.v2(window.winSize.width / 2, window.winSize.height / 2))//.sub(parent.convertToNodeSpaceAR(cc.v2(0, 0))).neg()
        // console.log(node.convertToWorldSpaceAR(cc.v2(0, 0)), parent.convertToNodeSpaceAR(cc.v2(0, 0)))
        return pos
    }
    createLabel(string: string, pos: cc.Vec2, pox: number = 100) {
        let label = PoolManager.instance.createObjectByName('damageLabel', GameUI.instance.view.labelContainer)
        label.getComponent(DamageLabel).init(string, pos, pox, {
            color: cc.Color.BLACK, outLineColor: cc.Color.WHITE, fontSize: 26
        })
    }
    // createDamageLabel(data: DamageData, pos: cc.Vec2, pox: number) {
    //     // if (!DD.instance.config[SysType.damageLabel]) return
    //     if (data.total <= 1) return
    //     let label = PoolManager.instance.createObjectByName('damageLabel', GameUI.instance.view.labelContainer)
    //     let color = cc.Color.GRAY
    //     if (data.atk > data.realAtk && data.atk > data.magicAtk) {
    //         color = cc.Color.RED
    //     } else if (data.magicAtk > data.realAtk && data.magicAtk > data.atk) {
    //         color = cc.color(96, 23, 159)
    //     }
    //     //伤害越多数字越大 最小为16 最大为60
    //     let fontSize = 18 + Math.pow(data.total, 0.3) 
    //     if (fontSize > 60) fontSize = 60
    //     //cc.color((data.atk || 0) / data.total * 255, (data.realAtk || 0) / data.total * 255, (data.magicAtk || 0) / data.total * 255)
    //     label.getComponent(DamageLabel).init((data.total.toFixed(0)) + '', pos, pox, {
    //         color: cc.Color.WHITE, outLineColor: color, fontSize, cri: false
    //     })
    // }
    // createCureLabel(data: DamageData, pos: cc.Vec2, pox: number) {
    //     // if (!DD.instance.config[SysType.damageLabel]) return
    //     if (data.total <= 1) return
    //     let label = PoolManager.instance.createObjectByName('damageLabel', GameUI.instance.view.labelContainer)
    //     label.getComponent(DamageLabel).init(data.total.toFixed(0) + '', pos, pox, {
    //         color: cc.Color.GREEN, outLineColor: cc.color(2, 59, 0), fontSize: 32
    //     })
    // }
    createMoneyLabel(money, pos: cc.Vec2) {
        if (money <= 0) return
        let label = PoolManager.instance.createObjectByName('damageLabel', GameUI.instance.view.labelContainer)
        label.getComponent(DamageLabel).init(money, pos, 0, {
            color: cc.Color.YELLOW, outLineColor: cc.Color.BLACK, fontSize: 18
        })
    }
    createMoneyEffect(num: number, start: cc.Vec2) {
        let nodeNum = Math.ceil(Math.sqrt(num / 10))
        for (let i = 0; i < nodeNum; i++) {
            let node = PoolManager.instance.createObjectByName('moneyEffectItem', GameUI.instance.view.effectContainer)
            node.setPosition(start)
            let long = Utils.getRandomNumber(50) + 50
            let angle = (Utils.getRandomNumber(180) - 180) / 180 * Math.PI
            node.getComponent(cc.Animation).play()
            cc.tween(node)
                .by(long / 200, { x: long * Math.cos(angle), y: long * Math.sin(angle) }, cc.easeIn(3))
                // .to(0.5, { x: end.x, y: end.y }, cc.easeOut(2))
                .call(() => {
                    EffectManager.instance.createMoneyLabel((num / nodeNum).toFixed(0), node.getPosition())
                    PoolManager.instance.removeObject(node)
                })
                .start()
            //let randomAngle=
        }
    }
    // createRewardItemSp(oid: number, pos: cc.Vec2, cb: Function, zindex = 199, endPos?, parent?, luck?) {
    //     if (!parent) {
    //         parent = LoopUIManager.instance.spEffectContainer
    //     }
    //     let name = luck ? 'luckItem' : 'spItem'
    //     let sp = PoolManager.instance.createObjectByName(name, parent)
    //     LoopUIManager.instance.spEffectContainer.zIndex = zindex
    //     sp.angle = 0
    //     sp.scale = 1
    //     sp.opacity = 255
    //     sp.stopAllActions()
    //     if (luck) {
    //         sp.getChildByName('sp').getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSpriteByOid(oid)
    //     } else {
    //         sp.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSpriteByOid(oid)
    //     }
    //     sp.setPosition(pos)
    //     sp.scale = 1
    //     let randomDiv = Utils.getNormalDivByAngel(-Utils.getRandomNumber(180))
    //     let randomLong = Utils.getRandomNumber(40) + 30
    //     if (!endPos) {
    //         endPos = cc.v2(10, -275)
    //     }
    //     //LoopUIManager.instance.bagBtn.node.convertToWorldSpaceAR(cc.v2(160, 576 / 2))
    //     cc.tween(sp)
    //         .by(0.4, { x: randomLong * randomDiv.x, y: randomLong * randomDiv.y }, cc.easeOut(2))
    //         .delay(0.3)
    //         .to(0.6, { x: endPos.x, y: endPos.y, scale: 0.2 }, cc.easeIn(2))
    //         .call(() => {
    //             PoolManager.instance.removeObject(name, sp)
    //             cb && cb()
    //         })
    //         .start()
    //     //向四周散开之后进入背包
    // }
    createEffect(name: string, pos: cc.Vec3 | cc.Vec2, node: cc.Node = GameUI.instance.view.effectContainer) {
        if (!name) return
        let effect = PoolManager.instance.createObjectByName('effectItem', node)
        effect.getComponent(EffectItem).init(name, pos, true)
    }
    // createFlyUpEffect(spName: string, pos: cc.Vec3 | cc.Vec2, node: cc.Node) {
    //     let sp = PoolManager.instance.createObjectByName('spItem', LoopUIManager.instance.spEffectContainer)
    //     LoopUIManager.instance.spEffectContainer.zIndex = 199
    //     sp.angle = 0
    //     sp.scale = 1
    //     sp.opacity = 255
    //     sp.stopAllActions()
    //     sp.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.ui, spName)
    //     sp.setPosition(pos.x, pos.y)
    //     cc.tween(sp).by(0.5, { y: 40, opacity: -255 }).call(() => {
    //         PoolManager.instance.removeObject('spItem', sp)
    //     }).start()
    // }

    createPartical(name: string, pos: cc.Vec2, node: cc.Node = GameUI.instance.view.effectContainer) {
        // if (!DD.instance.config[SysType.effect]) return
        let partical = PoolManager.instance.createObjectByName('particalItem', node)
        partical.setPosition(pos)
        ResourceManager.instance.getPartical(name).then((res: cc.ParticleAsset) => {
            let par = partical.getComponent(cc.ParticleSystem)
            par.stopSystem()
            par.file = res
            par.custom = true
            par.custom = false
            par.resetSystem()
        })

        return partical
    }

    // createThrowEffet(spName: string, startPos: cc.Vec2, endPos: cc.Vec2, cb: Function, node: cc.Node ) {
    //     let sp = PoolManager.instance.createObjectByName('spItem', node)
    //     sp.angle = 0
    //     sp.scale = 0.6
    //     sp.opacity = 255
    //     sp.stopAllActions()
    //     sp.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.ui, spName)
    //     sp.setPosition(startPos.x, startPos.y)
    //     let height = startPos.y + endPos.y + 120
    //     cc.tween(sp).parallel(
    //         cc.tween().to(1, { x: endPos.x, angle: 360 }),
    //         cc.tween().sequence(
    //             cc.tween().to(0.5, { y: height, scale: 1 }, cc.easeOut(2)),
    //             cc.tween().to(0.5, { y: endPos.y, scale: 0.6, opacity: 0 }, cc.easeIn(2)),
    //         )
    //     ).call(() => {
    //         if (cb) {
    //             cb()
    //         }
    //         PoolManager.instance.removeObject('spItem', sp)
    //     }).start()
    // }

}