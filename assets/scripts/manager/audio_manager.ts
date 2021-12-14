/**
 * @description 音频管理 会自动读取resources下的audio文件夹和music文件夹
 */

import DD from "./dynamic_data_manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    static instance: AudioManager = null

    sourceMaps: {} = {}

    onLoad() {
        AudioManager.instance = this
    }
    init() {
        this.playBGM('opening')
    }
    /**
     * 加载音频
     * @param {string} name 音频文件名
     * @param {number} volume 音频声音大小
     */
    loadAudioClip(name: string, volume: number = DD.instance.config.audio) {
        cc.resources.load("audio/" + name, (err, audioClip: cc.AudioClip) => {
            this.sourceMaps[name] = audioClip
            cc.audioEngine.setEffectsVolume(volume)
            cc.audioEngine.playEffect(audioClip, false)
        })
    }

    loadBGMClip(name: string, volume: number = DD.instance.config.music) {
        cc.loader.loadRes("music/" + name, (err, audioClip) => {
            // console.log('bgm', name, err)
            this.sourceMaps[name] = audioClip
            cc.audioEngine.setMusicVolume(volume)
            cc.audioEngine.playMusic(audioClip, true)
        })
    }

    /**
     * 播放音频
     * @param {string} name 音频文件名
     * @param {number} volume 音频声音大小
     */

    audioTimer: any = null
    //为了防止同时播放太多音乐导致音量过大
    canAudio: boolean = true
    playAudio(name, volume: number = DD.instance.config.audio) {
        if (!this.canAudio) return
        this.canAudio = false
        this.audioTimer = setTimeout(() => {
            this.canAudio = true
        }, 30);
        if (this.sourceMaps[name]) {
            let audioClip = this.sourceMaps[name]
            cc.audioEngine.setEffectsVolume(volume)
            cc.audioEngine.playEffect(audioClip, false)
        } else {
            this.loadAudioClip(name, volume)
        }
    }
    switchBgmTween: cc.Tween = null
    playBGM(name: string, volume: number = DD.instance.config.music) {
        //增加一个渐变
        if (this.switchBgmTween) this.switchBgmTween.stop()
        let data = { volume }
        this.switchBgmTween = cc.tween(data)
            .to(0.5, { volume: 0 }, {
                onUpdate: () => {
                    cc.audioEngine.setMusicVolume(data.volume)
                }
            })
            .call(() => {
                if (this.sourceMaps[name]) {
                    let music = this.sourceMaps[name]
                    cc.audioEngine.playMusic(music, true)
                } else {
                    this.loadBGMClip(name, volume)
                }
            })
            .to(0.5, { volume }, {
                onUpdate: () => {
                    cc.audioEngine.setMusicVolume(data.volume)
                }
            })
            .start()
    }
    changeBgmVolume(volume) {
        cc.audioEngine.setMusicVolume(volume)
    }
}
