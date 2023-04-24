import DD from "./dynamic_data_manager";
import ResourceManager from "./resources_manager";
import StorageManager from "./storage_manager";
import UIManager from "./ui_manager";

const { ccclass, property } = cc._decorator;

//整个游戏的控制器
declare global {
    interface Window {
        winSize: any
    }
}
@ccclass
export default class MainManager extends cc.Component {
    static instance: MainManager = null
    timer: number = 0
    onLoad() {
        MainManager.instance = this
        this.setDesignResolution()
        ResourceManager.instance.init()
        //加载资源
    }
    resLoaded() {
        console.log('资源加载完毕')
        //展示开始按钮
        //判断是否初次开始游戏
        let configData = StorageManager.instance.loadDataByKey('config')
        if (configData) {
            //加载配置 判断版本号
            if (StorageManager.instance.loadDataByKey('userdata')) {
                StorageManager.instance.loadPlayerData()
              
            }
        } else {
            // StorageManager.instance.saveDataByKey('config', DD.instance.config)
            //首次进入游戏
            //  DD.instance.initGame()
        }
        // AudioManager.instance.init()
    }

    //适配
    setDesignResolution() {
        var canvas = cc.find("Canvas").getComponent(cc.Canvas)
        var winSize = cc.winSize
        window.winSize = winSize
        if (winSize.width / winSize.height > 640 / 1134) {
            canvas.fitWidth = false
            canvas.fitHeight = true
        } else {
            canvas.fitWidth = true
            canvas.fitHeight = false
        }
    }
}
