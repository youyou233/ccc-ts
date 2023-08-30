
import { Config } from "../utils/config";
import { Emitter } from "../utils/emmiter";
import { MessageType } from "../utils/message";
import ResourceManager from "./resources_manager";

const { ccclass, property } = cc._decorator;
/**
 * 节点池管理器
 * 将预制体创建好之后放入resources/prefab文件夹下 将预制体的名字写入config的resConfig.prefabArr中
 * 然后使用createObjectByName(名字，父节点)即可创建
 */
@ccclass
export default class PoolManager extends cc.Component {
    static _instance: PoolManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new PoolManager()
        }
        return this._instance
    }
    _Pool: cc.NodePool[] = []
    init() {
        for (let i = 0; i < Config.resConfig.prefabArr.length; i++) {
            this._Pool[i] = new cc.NodePool()
            let node = cc.instantiate(ResourceManager.instance._Prefab[i])

            this._Pool[i].put(node)
        }
        Emitter.fire(MessageType.poolLoaded)
    }
    createObjectByName(name: string, parentNode: cc.Node): cc.Node {
        let index = Config.resConfig.prefabArr.indexOf(name)
        if (index == -1) {
            console.log('填写了错误的name', name)
            return
        }
        let curPrefab = ResourceManager.instance._Prefab[index]
        let curPool = this._Pool[index]

        let result: cc.Node

        if (curPool != null) {
            if (curPool.size() > 0) {
                result = curPool.get()
            } else {
                result = cc.instantiate(curPrefab)
            }
            if (parentNode) {
                result.parent = parentNode
            }
        }

        return result
    }
    removeObject(obj: cc.Node) {
        let name = obj.name
        let index = Config.resConfig.prefabArr.indexOf(name)
        if (index == -1) {
            console.log('填写了错误的name', name)
            return
        }
        let pool = this._Pool[index]
        if (pool != null) {
            pool.put(obj)
        } else {
            console.error("no this pool:" + name)
        }
    }
    //移除一个container下所有节点
    removeObjByContainer(container: cc.Node, name?: string) {
        for (let i = container.children.length - 1; i >= 0; i--) {
            let node = container.children[i]
            this.removeObject(node)
        }
    }
    destoryObjByContainer(container: cc.Node) {
        for (let i = container.children.length - 1; i >= 0; i--) {
            let node = container.children[i]
            node.destroy()
        }
    }
}