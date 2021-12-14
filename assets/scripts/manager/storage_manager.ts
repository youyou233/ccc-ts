
import { Utils } from "../utils/utils"
import DD from "./dynamic_data_manager"


/**
 *
 * @dec 本地存储文件
 */
const { ccclass, property } = cc._decorator

@ccclass
export default class StorageManager extends cc.Component {
    static _instance: StorageManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new StorageManager()
        }
        return this._instance
    }
    bindEvent() {

    }
    loadDataByKey(key: string) {
        let data = cc.sys.localStorage.getItem(key)
        if (data) {
            return JSON.parse(data)
        } else {
            return null
        }
    }
    saveDataByKey(key: string, data) {
        cc.sys.localStorage.setItem(key, JSON.stringify(data))
    }
    removeDataByKey(key: string) {
        cc.sys.localStorage.removeItem(key)
    }
    /**
     * 加载本地资源
     */
    loadPlayerData() {
        return new Promise((resolve, reject) => {
            let data = this.loadDataByKey('userdata')
            //在这里加载数据
            // HomeManager.instance.buildings = data['B']

            //  DD.instance.gender = data['GD']

            resolve(data)
        })
    }
    /**
     * 保存数据
     */
    savePlayerData(name: string = 'userdata', data) {
        cc.sys.localStorage.setItem(name, JSON.stringify(data))
        cc.log('数据保存成功')
        return data
    }
    isFristPlay() {
        if (cc.sys.localStorage.getItem('isFirst')) {
            return false
        } else {
            return true
        }
    }
}
