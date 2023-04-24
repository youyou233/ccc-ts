const MainEvent = require('../eazax/main-event');
const EditorMainKit = require('../eazax/editor-main-kit');
const { checkUpdate } = require('../eazax/editor-main-util');
const { openRepository } = require('../eazax/package-util');
const ConfigManager = require('../common/config-manager');
const Opener = require('./opener');
const PanelManager = require('./panel-manager');

/**
 * 生命周期：加载
 */
function load() {
    // 监听事件
    EditorMainKit.register();
    MainEvent.on('ready', onReadyEvent);
    MainEvent.on('select', onSelectEvent);
}

/**
 * 生命周期：卸载
 */
function unload() {
    // 取消事件监听
    EditorMainKit.unregister();
    MainEvent.removeAllListeners('ready');
    MainEvent.removeAllListeners('select');
}

/**
 * （渲染进程）就绪事件回调
 * @param {Electron.IpcMainEvent} event 
 */
function onReadyEvent(event) {
    // 检查编辑器选中
    Opener.checkEditorCurSelection();
}

/**
 * （渲染进程）选择文件事件回调
 * @param {Electron.IpcMainEvent} event 
 */
function onSelectEvent(event) {
    Opener.selectLocalFiles();
}

/**
 * 编辑器选中事件回调
 * @param {string} type 类型
 * @param {string[]} uuids uuids
 */
function onEditorSelection(type, uuids) {
    if (PanelManager.getViewPanel()) {
        Opener.identifySelection(type, uuids);
    }
}

module.exports = {

    /**
     * 扩展消息
     */
    messages: {

        /**
         * 编辑器选中事件回调
         * @param {Electron.IpcMainEvent} event 
         * @param {string} type 类型
         * @param {string[]} uuids uuids
         */
        'selection:selected'(event, type, uuids) {
            onEditorSelection(type, uuids);
        },

        /**
         * 打开预览面板
         */
        'open-view-panel'() {
            PanelManager.openViewPanel();
        },

        /**
         * 打开设置面板
         */
        'open-settings-panel'() {
            PanelManager.openSettingsPanel();
        },

        /**
         * 检查更新
         */
        'menu-check-update'() {
            checkUpdate(true);
        },

        /**
         * 版本
         * @param {*} event 
         */
        'menu-version'(event) {
            openRepository();
        },

        /**
         * 场景面板加载完成后
         * @param {*} event 
         */
        'scene:ready'(event) {
            // 自动检查更新
            const config = ConfigManager.get();
            if (config.autoCheckUpdate) {
                checkUpdate(false);
            }
        },

    },

    load,

    unload,

};
