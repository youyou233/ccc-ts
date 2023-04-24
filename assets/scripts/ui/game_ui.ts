//主体游戏UI
const { ccclass, property } = cc._decorator
@ccclass
export default class GameUI extends cc.Component {
    static instance: GameUI = null
    @property(cc.Node)
    labelContainer: cc.Node = null
    @property(cc.Node)
    effectContainer: cc.Node = null
}