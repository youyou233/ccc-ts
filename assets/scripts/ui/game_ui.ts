//主体游戏UI
const { ccclass, property } = cc._decorator
@ccclass
export default class GameUI extends cc.Component {
    static instance: GameUI = null
    view: any//GameUIView = new GameUIView()
    onLoad() {
        this.view.initView(this.node)
        GameUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this.view.btnBack.node.on("click", this.hideUI, this)
        this.view.nodeMask.on("click", this.hideUI, this)
        //Emitter.register(MessageType.XXXXXX, this._refresh, this)
    }
    
    showUI() {
        this.view.content.active = true
    }

    hideUI() {
        this.view.content.active = false
    }
}