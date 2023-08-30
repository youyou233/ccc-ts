
import { Emitter } from "../utils/emmiter";
import { MessageType } from "../utils/message";
import { Config } from "../utils/config";
import ResourceManager from "./resources_manager";

const { ccclass, property } = cc._decorator;
/**
 * json数据管理器
 * 将excel用导表工具导入resources/json文件夹下 将json文件的名字写入config的resConfig.jsonArr中
 * 然后使用getDataByName(名字)即可获得
 */
@ccclass
export default class JsonManager extends cc.Component {
    static _instance: JsonManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new JsonManager()
        }
        return this._instance
    }
    _Data: any[] = []
    init() {
        for (let i = 0; i < Config.resConfig.jsonArr.length; i++) {
            this._Data[i] = ResourceManager.instance._Json[i].json
        }
        Emitter.fire(MessageType.jsonLoaded)
    }
    getDataByName(name: string) {
        let index = Config.resConfig.jsonArr.indexOf(name)
        if (index == -1) {
            console.log('填写了错误的name', name)
            return
        }
        return this._Data[index]
    }
    getConfig(name: string) {
        return this._Data[0][1][name]
    }
}