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
     * 从下方打开页面
     * @param content
     * @param mask
     * @param hard
     */
    showDialog(content: cc.Node, mask?: cc.Node) {
        content.stopAllActions()
        content.active = true
        content.y = -cc.winSize.height / 2
        content.opacity = 50
        //content.x = left ? -this.screenWidth : this.screenWidth
        cc.tween(content).to(0.3, { x: 0, y: 0, opacity: 255 }, cc.easeBackOut()).start()
        if (mask) {
            mask.stopAllActions()
            mask.opacity = 0
            // let maskAction = cc.fadeIn(0.3)
            // mask.runAction(maskAction)
            new cc.Tween(mask).to(0.3, { opacity: 210 }, cc.easeIn(3)).start()
        }
    }
    /**
     * 关闭页面
     * @param content
     * @param mask
     * @param hard
     */
    hideDialog(content: cc.Node, mask: cc.Node, endCb?: Function) {
        content.stopAllActions()

        if (mask) {
            mask.stopAllActions()
            new cc.Tween(mask).to(0.2, { opacity: 210 }, cc.easeIn(1)).start()
        }
        cc.tween(content)
            .to(0.2, { opacity: 50, y: -cc.winSize.height / 2 }, cc.easeOut(2))
            .call(() => {
                content.active = false
                if (endCb) endCb()
            })
            .start()
    }

    /**
     * 浮现打开页面
     */
    fadeShowDialog(content: cc.Node, time: number = 0.25) {
        content.stopAllActions()
        content.opacity = 0
        content.active = true
        cc.tween(content).to(time, { opacity: 255 }).start()
    }

    /**
     * 浮现关闭页面
     */
    fadeHideDialog(content: cc.Node, time: number = 0.1, endCb?: Function) {
        content.stopAllActions()
        cc.tween(content)
            .to(time, { opacity: 0 })
            .call(() => {
                content.active = false
                if (endCb) endCb()
            })
            .start()
    }

    /**
     *  弹出页面
     */
    popOut(content: cc.Node, mask?: cc.Node, time: number = 0.33) {
        content.stopAllActions()
        content.active = true
        content.opacity = 255
        content.scale = 0.5
        cc.tween(content).to(time, { scale: 1 }, cc.easeElasticOut(1)).start()
        //  cc.sequence(cc.scaleTo(time, 1).easing(cc.easeElasticOut(1)), cc.callFunc(() => {
        // }))
        if (mask) {
            mask.stopAllActions()
            mask.opacity = 0
            new cc.Tween().target(mask).to(time, { opacity: 120 }, cc.easeIn(1)).start()
        }
    }

    /**
     * 弹出节点
     * @param node 目标节点
     * @param time 弹出时间
     * @param cb 动画结束回调
     */
    showPopoutAction(node, time, cb?) {
        node.stopAllActions()
        node.active = true
        node.opacity = 255
        node.scale = 0.5
        cc.tween(node)
            .to(time, { scale: 1 }, cc.easeElasticOut(1))
            .call(() => {
                if (cb) cb()
            })
            .start()
        //  cc.sequence(cc.scaleTo(time, 1).easing(cc.easeElasticOut(1)), cc.callFunc(() => {
        // }))
    }
    /**
        * 摇晃
        * @param node
        */
    showShake(node: cc.Node) {
        node.stopAllActions()
        cc.tween(node)
            .by(0.04, { angle: 7.5 })
            .by(0.04, { angle: -15 })
            .by(0.04, { angle: 15 })
            .by(0.04, { angle: -15 })
            .by(0.04, { angle: 15 })
            .by(0.04, { angle: -15 })
            .by(0.04, { angle: 15 })
            .by(0.04, { angle: -7.5 })
            .start()
    }

    /** 从A到B */
    moveA2B(node: cc.Node, posStart: cc.Vec2, posEnd: cc.Vec2, time: number = 0.6) {
        return new Promise((resolve) => {
            new cc.Tween(node)
                .set({ position: posStart })
                .to(time, { position: posEnd })
                .call(() => {
                    resolve(true)
                })
                .start()
        })
    }

}