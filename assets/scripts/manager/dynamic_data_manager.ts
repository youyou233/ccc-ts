import { ConfigData } from "../interface/config_data"

const { ccclass, property } = cc._decorator
/**
 * 此文件用于控制游戏中所有数据 以及可视化绑定
 */
@ccclass
export default class DD extends cc.Component {
    static _instance: DD = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new DD()
        }
        return this._instance
    }
    config: ConfigData = null

    //道具仓库
    itemDepot: { [key: number]: number } = { }

    /**
   * 判断是否足够
   * @param cost 
   * @param tip 提示
   */
    checkEnough(cost: { [key: number]: number }, tip: boolean = false) {
        let have = true
        let noHaveId = []
        for (let id in cost) {
            if (this.itemDepot[id]) {
                if (cost[id] > this.itemDepot[id]) {
                    have = false
                    noHaveId.push(+id)
                }
            } else {
                have = false
                noHaveId.push(+id)
            }
        }
        if (tip && !have) {

        }
        return have
    }
    /**
     * 获得某个物品
     */
    onReward(costData) {
        for (let itemId in costData) {

        }
    }

    /**
     * 花费某个物品
     */
    onCost(costData) {
        for (let itemId in costData) {
            if (this.itemDepot[itemId]) {
                this.itemDepot[itemId] -= costData[itemId]
            }
        }
    }
}