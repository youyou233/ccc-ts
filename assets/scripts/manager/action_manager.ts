/**
 * actionManager主要是给打开页面关闭页面弹框之类的一个缓动效果
 */
export default class ActionManager {
    static _instance: ActionManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new ActionManager()
        }
        return this._instance
    }


    screenWidth: number = cc.view.getFrameSize().width
    screenHeight: number = cc.view.getFrameSize().height

    /**
     * 打开页面
     * @param content
     * @param mask
     * @param hard
     */
    showDialog(content: cc.Node, mask?: cc.Node, left?: boolean) {
        if (content.active) return
        content.stopAllActions()
        content.active = true
        content.x = left ? -this.screenWidth : this.screenWidth
        let contentAction = cc.sequence(
            cc.moveTo(0.3, 0, 0).easing(cc.easeInOut(3)),
            cc.callFunc(() => {
            })
        )
        content.runAction(contentAction)
        if (mask) {
            mask.stopAllActions()
            mask.opacity = 0
            // let maskAction = cc.fadeIn(0.3)
            // mask.runAction(maskAction)
            new cc.Tween()
                .target(mask)
                .to(0.3, { opacity: 210 }, cc.easeIn(3))
                .start()
        }
    }
    /**
     * 关闭页面
     * @param content
     * @param mask
     * @param hard
     */
    hideDialog(content: cc.Node, mask: cc.Node) {
        content.stopAllActions()
        mask.stopAllActions()
        if (mask) {
            new cc.Tween()
                .target(mask)
                .to(0.2, { opacity: 210 }, cc.easeIn(1))
                .start()
        }
        let contentAction = cc.sequence(
            cc.moveTo(0.2, this.screenWidth, 0).easing(cc.easeIn(1)),
            cc.callFunc(() => {
                content.active = false
            })
        )
        content.runAction(contentAction)
    }

    /**
     * 浮现打开页面
     */
    fadeShowDialog(content: cc.Node, time?: number) {
        if (content.active) return
        content.stopAllActions()
        content.opacity = 0
        content.active = true
        cc.tween()
        let contentAction = cc.sequence(
            cc.fadeIn(time ? time : 0.2),
            cc.callFunc(() => {
            })
        )
        content.runAction(contentAction)
    }

    /**
     * 浮现关闭页面
     */
    fadeHideDialog(content: cc.Node, time: number = 0.2) {
        if (!content.active) return
        content.stopAllActions()
        let contentAction = cc.sequence(
            cc.fadeOut(time),
            cc.callFunc(() => {
                content.active = false
            })
        )
        content.runAction(contentAction)
    }

    /**
     *  弹出页面
     */
    popOut(content: cc.Node, mask?: cc.Node) {
        if (content.active) return
        content.stopAllActions()
        content.active = true
        content.opacity = 255
        content.scale = 0.5
        let action = cc.sequence(cc.scaleTo(0.2, 1).easing(cc.easeElasticOut(1)), cc.callFunc(() => {
        }))
        content.runAction(action)
        if (mask) {
            mask.stopAllActions()
            mask.opacity = 0
            new cc.Tween()
                .target(mask)
                .to(0.2, { opacity: 210 }, cc.easeIn(1))
                .start()
        }
    }

}
