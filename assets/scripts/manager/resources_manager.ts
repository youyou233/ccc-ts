import { Emitter } from "../utils/emmiter"
import config from "../utils/config"
import { MessageType } from "../utils/message"
import { ResType } from "../utils/enum"
import JsonManager from "./json_manager"
import PoolManager from "./pool_manager"
import MainManager from "./main_manager"

const { ccclass, property } = cc._decorator


@ccclass
export default class ResourceManager extends cc.Component {
    static _instance: ResourceManager = null
    static get instance() {
        if (this._instance == null) {
            this._instance = new ResourceManager()
        }
        return this._instance
    }
    //图集资源
    _Atlas: cc.SpriteAtlas[] = []
    //json数据资源
    _Json: cc.JsonAsset[] = []
    //预制体资源
    _Prefab: cc.Prefab[] = []
    _Animation: { [key: string]: cc.AnimationClip } = {}
    _Spine: { [key: number]: sp.SkeletonData } = {}
    // _WalkAnima: { [key: string]: cc.AnimationClip } = {}
    _Partical: { [key: string]: cc.ParticleAsset } = {}
    _Background: { [key: string]: cc.SpriteFrame } = {}
    _dragonBones: { [key: string]: any } = {}
    loading: number = 0
    init() {
        console.log("ResourceManager loading ...");
        this.bindEvent()
        //加载全部图集
        let altasArr = config.resConfig.altasArr.map((item) => { return 'atlas/' + item })
        let self = this
        //this.getSpine('role_1')
        cc.loader.loadResArray(altasArr, cc.SpriteAtlas, (err, atlas) => {
            if (err) {
                console.error(err);
                return;
            }
            self._Atlas = atlas
            Emitter.fire( MessageType.atlasLoaded)
        })
        let jsonArr = config.resConfig.jsonArr.map((item) => { return 'json/' + item })
        cc.loader.loadResArray(jsonArr, cc.JsonAsset, (err, jsons) => {
            if (err) {
                console.error(err);
                return;
            }
            self._Json = jsons
            JsonManager.instance.init()
        })
        let prefabArr = config.resConfig.prefabArr.map((item) => { return 'prefab/' + item })
        cc.loader.loadResArray(prefabArr, cc.Prefab, (err, prefabs) => {
            if (err) {
                console.error(err);
                return;
            }
            self._Prefab = prefabs
            PoolManager.instance.init()
        })

        //动态加载

    }
    bindEvent() {
        Emitter.register( MessageType.atlasLoaded, (name, data) => {
            ResourceManager.instance.loadedRes()
            Emitter.remove( MessageType.atlasLoaded, '')
        }, '')
        Emitter.register( MessageType.poolLoaded, (name, data) => {
            ResourceManager.instance.loadedRes()
            Emitter.remove( MessageType.poolLoaded, '')
        }, '')
        Emitter.register( MessageType.jsonLoaded, (name, data) => {
            ResourceManager.instance.loadedRes()
            Emitter.remove( MessageType.jsonLoaded, '')
        }, '')
    }
    loadedRes() {
        this.loading++
        if (this.loading == 3) {
            MainManager.instance.resLoaded()
        }
        //延迟加载全部的龙骨
        // for (let id in JsonManager.instance.getDataByName('role')) {
        //     if (+id > 10 && +id < 61) {
        //         this.getDragonBones(JsonManager.instance.getDataByName('role')[id].db)
        //     }
        // }
    }
    /**
     * 从图集中获取图片
     * @param type 图集的类型 注意类型的顺序要和config.atlasArr中的顺序对应 
     * @param name 图片的名字
     * @returns 
     */
    getSprite(type: ResType, name: string): cc.SpriteFrame {
        if (this._Atlas[type]) {
            return this._Atlas[type].getSpriteFrame(name)
        }
        return null
    }
    /**
    * 得到动画
    * @param name 
    * @param param smaple funcs
    */
    getAnimation(name: string, effect: boolean = true): Promise<cc.AnimationClip> {
        let param = JsonManager.instance.getDataByName('animation')[name]
        //如果没有param则自己生成
        return new Promise((resolve, reject) => {
            if (this._Animation[name]) {
                resolve(this._Animation[name])
            } else {
                let url = 'animation/' + name
                if (effect) {
                    url = 'effect/' + name
                }
                cc.loader.loadRes(url, cc.SpriteAtlas, (err, atlas) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    let frames: [cc.SpriteFrame] = atlas.getSpriteFrames()
                    let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(frames, frames.length)
                    clip = this.createClip(name, frames, param)
                    this._Animation[name] = clip
                    resolve(clip)
                })
            }
        })
    }

    //常用特效合批

    /**
         * 创建一个帧动画
         * @param name 
         * @param frames 
         * @param param 
         * @returns 
         */
    createClip(name, frames, param) {
        if (!param) {
            param = {
                sample: frames.length,
                speed: 30 / frames.length,
                wrapMode: 0
            }
        }
        frames.sort((a, b) => {
            let numa = +a.name.split('_')[2]
            let numb = +b.name.split('_')[2]
            return numa - numb
        })
        let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(frames, frames.length)
        clip.name = name
        clip.sample = param.sample
        clip.speed = param.speed
        let wrapList = [cc.WrapMode.Normal, cc.WrapMode.Loop, cc.WrapMode.PingPong]
        clip.wrapMode = wrapList[param.wrapMode]
        if (param.funcs) {
            //自定义帧事件
            clip.events.push(...param.funcs)
        }
        return clip
    }
    getPartical(name: string): Promise<cc.ParticleAsset> {
        return new Promise((resolve, reject) => {
            if (this._Partical[name]) {
                resolve(this._Partical[name])
            } else {
                let url = 'partical/' + name
                cc.resources.load(url, cc.ParticleAsset, (err, partical) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        this._Partical[name] = partical
                        resolve(partical)
                    }
                })
            }
        })
    }
    getBackGround(name: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve, reject) => {
            if (this._Background[name]) {
                resolve(this._Background[name])
            } else {
                let url = 'bg/' + name
                cc.resources.load(url, cc.SpriteFrame, (err, sp: cc.SpriteFrame) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        this._Background[name] = sp
                        resolve(sp)
                    }
                })
            }
        })
    }

    getSpine(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._Spine[name]) {
                resolve(this._Spine[name])
            } else {
                cc.resources.load('spine/' + name, sp.SkeletonData, (err, asset: sp.SkeletonData) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        this._Spine[name] = asset
                        resolve(asset)
                    }

                })
            }
        })
    }
    /**
     * 获取人物走动动画
     * @param staff 是否是雇员
     * @param arr 方向
     * @param id 编号
     */
    // getWalkAniamtion(staff: boolean, arr: WalkArrType, id: number) {
    //     return new Promise((resolve, reject) => {
    //         let name = (staff ? 'staff_walk_' : 'costomer_walk_') + id + '-'
    //         if (this._WalkAnima[name + arr]) {
    //             resolve(this._Animation[name])
    //         } else {
    //             let frames: cc.SpriteFrame[] = []
    //             for (let i = arr * 3; i < (arr + 1) * 3; i++) {
    //                 let spName = name + i
    //                 frames.push(this.getSprite(ResType.walk, spName))
    //             }
    //             let clip: cc.AnimationClip = cc.AnimationClip.createWithSpriteFrames(frames, frames.length)
    //             clip.name = name + arr
    //             clip.sample = 3
    //             clip.speed = 2
    //             clip.wrapMode = cc.WrapMode.PingPongReverse
    //             this._Animation[name + arr] = clip
    //             resolve(clip)
    //         }

    //     })
    // }

    /**
   * 读取dragonbones文件 一般是Boss
   * @param name 
   * @returns 
   */
    getDragonBones(name: string): Promise<any> {
        // console.log('开始加载龙骨动画')
        return new Promise((resolve, reject) => {
            if (this._dragonBones[name]) {
                resolve(this._dragonBones[name])
            } else {
                this._dragonBones[name] = {}
                cc.resources.loadDir('db/' + name, (err, asset: any[]) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // console.log('动态加载龙骨动画中')
                    for (let i in asset) {
                        if (asset[i] instanceof dragonBones.DragonBonesAsset) {
                            this._dragonBones[name].dba = asset[i]
                        }
                        if (asset[i] instanceof dragonBones.DragonBonesAtlasAsset) {
                            this._dragonBones[name].dbaa = asset[i]
                        }
                        // if (asset[i] instanceof cc.TextAsset) {
                        //     this._dragonBones[name].config = asset[i]
                        //     debugger
                        // }
                    }
                    cc.log('骨骼信息', asset)
                    resolve(this._dragonBones[name])
                })

            }
        })
    }
    transTxtConfigToData(txt: string) {

    }

    getBigEffect(name: string) {
        let param = JsonManager.instance.getDataByName('animation')[name]
        return new Promise((resolve, reject) => {
            if (this._Animation[name]) {
                resolve(this._Animation[name])
            } else {
                let url = ''
                url = 'bigEffect/' + name
                cc.resources.loadDir(url, cc.SpriteFrame, (err, sfs: cc.SpriteFrame[]) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    let frames: cc.SpriteFrame[] = sfs
                    let clip = this.createClip(name, frames, param)
                    this._Animation[name] = clip
                    resolve(clip)
                })
            }
        })
    }
    // getDragonboneConfig(name: string) {
    //     return new Promise((resolve, reject) => {
    //         if (this._dbConfig[name]) {
    //             resolve(this._dbConfig[name])
    //         } else {
    //             cc.loader.loadRes('db/' + name + '/' + name + '', cc.TextAsset, (error, res) => {
    //                 if (err) {
    //                     console.error(err);
    //                     return;
    //                 }
    //             })
    //         }
    //     })

    // }
}